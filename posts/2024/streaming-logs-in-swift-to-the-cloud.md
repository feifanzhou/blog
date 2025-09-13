---
title: Streaming Logs in Swift to the Cloud
date: '2024-06-22'
updated: '2024-06-22'
slug: streaming-logs-in-swift-to-the-cloud
excerpt: >-
  Ahead of getting a few friends to be Tanagram's first users, I wanted to have
  streaming logs — logs that would show up automatically in a web service as
  soon as they were emitted. Since Tanagram is a...
---


Ahead of getting a few friends to be [Tanagram](https://tanagram.app)'s first users, I wanted to have streaming logs — logs that would show up automatically in a web service ~as soon as they were emitted. Since Tanagram is a currently a small project and is only a desktop app, I didn't want to use expensive, enterprise-focused products like Splunk or Datadog, and I didn't necessarily want to setup and navigate the complexity of a full cloud suite like AWS if I could help it.

I ended up finding [HyperDX](https://www.hyperdx.io/), which seemed like a nice fit for Tanagram — it had a sufficient free tier, and appeared to be simple enough for me to quickly start using it. However, their installation documentation didn't have Swift-specific guidance, although they do support OpenTelemetry [directly](https://www.hyperdx.io/docs/install/opentelemetry). Unfortunately, the OpenTelemetry documentation for logs in Swift is [extremely lacking](https://opentelemetry.io/docs/languages/swift/instrumentation/#logs) (as of this writing, it only says "The logs API & SDK are currently under development", and … nothing else). I also found the OpenTelemetry-Swift documentation lacking in explanation about the difference between all the different classes and how they were meant to be used. 

I decided that it seemed like a fun challenge, so I made a warm cup of coffee and gave myself a few hours to try to get a log line to appear in HyperDX. This is what I came up with (also available as a [gist](https://gist.github.com/feifanzhou/51d87821127d5094a057864b4ae5807d)):

```swift
import Foundation
// Yes, you need to import all of these modules individually
import GRPC
import Logging
import NIO
import NIOHPACK
import OpenTelemetryApi
import OpenTelemetrySdk
import OpenTelemetryProtocolExporterCommon
import OpenTelemetryProtocolExporterGrpc

// Implement a swift-log LogHandler so I can use the swift-log API as the frontend interface for callsites:
// https://github.com/apple/swift-log?tab=readme-ov-file#on-the-implementation-of-a-logging-backend-a-loghandler
struct OTLog: Logging.LogHandler {
    static func register() {
        let configuration = ClientConnection.Configuration(
            target: .hostAndPort("in-otel.hyperdx.io", 4317),
            eventLoopGroup: MultiThreadedEventLoopGroup(numberOfThreads: 1),
            // Enable TLS to get through App Transport Security
            tls: .init(),
            backgroundActivityLogger: Logging.Logger(label: "io.grpc", factory: { StreamLogHandler.standardOutput(label: $0) })
        )
#if DEBUG
        let deploymentEnvironment = "debug"
#else
        let deploymentEnvironment = "release"
#endif
        // Default metadata attributes that will be included with every log line
        let resourceAttributes = [
            ResourceAttributes.deploymentEnvironment.rawValue: AttributeValue.string(deploymentEnvironment),
            ResourceAttributes.hostName.rawValue:
                AttributeValue.string(ProcessInfo.processInfo.hostName),
            ResourceAttributes.osVersion.rawValue:
                AttributeValue.string(ProcessInfo.processInfo.operatingSystemVersionString),
            ResourceAttributes.serviceName.rawValue: AttributeValue.string("\(ProcessInfo.processInfo.processName)"),
            ResourceAttributes.telemetrySdkName.rawValue: AttributeValue.string("opentelemetry"),
            ResourceAttributes.telemetrySdkLanguage.rawValue: AttributeValue.string("swift"),
            ResourceAttributes.telemetrySdkVersion.rawValue: AttributeValue.string(Resource.OTEL_SWIFT_SDK_VERSION)
        ]
        OpenTelemetry.registerLoggerProvider(
            loggerProvider: LoggerProviderBuilder()
                .with(
                    processors: [
                        BatchLogRecordProcessor(
                            logRecordExporter: GzippedOtlpLogExporter(
                                channel: ClientConnection(
                                    configuration: configuration
                                ),
                                // Set your API Key via the Authorization header
                                config: OtlpConfiguration(headers: [("authorization", "<YOUR_API_KEY>")]),
                                logger: Logging.Logger(label: "io.grpc", factory: { StreamLogHandler.standardOutput(label: $0) })
                            )
                        )
                    ]
                )
                .with(resource: Resource(attributes: resourceAttributes))
                .build()
        )
        
        LoggingSystem.bootstrap(Self.init)
    }
    
    static func `default`() -> Logging.Logger {
        return Logging.Logger(label: "default")
    }
    
    private var eventProvider: any OpenTelemetryApi.Logger
    
    // MARK: - 
    // MARK: swift-log LogHandler protocol
    var metadata: Logging.Logger.Metadata
    var logLevel: Logging.Logger.Level
    
    init(label: String) {
        self.eventProvider = OpenTelemetry.instance.loggerProvider
            .loggerBuilder(
                instrumentationScopeName: "<YOUR_PROJECT_NAME>"
            )
            .setEventDomain(label)
            .setIncludeTraceContext(true)
            .build()
        self.metadata = .init()
        self.logLevel = .debug
    }
    
    subscript(metadataKey key: String) -> Logging.Logger.Metadata.Value? {
        get {
            self.metadata[key]
        }
        set(newValue) {
            self.metadata[key] = newValue
        }
    }
    
    func log(
        level: Logging.Logger.Level,
        message: Logging.Logger.Message,
        metadata: Logging.Logger.Metadata?,
        source: String,
        file: String,
        function: String,
        line: UInt) {
            var attributes: [String: AttributeValue] = [:]
            if let nonNilMetadata = metadata {
                for (key, value) in nonNilMetadata {
                    switch value {
                    case .string(let str):
                        attributes[key] = AttributeValue(str)
                    default:
                        // TODO: Figure out other attribute values
                        continue
                    }
                }
            }
            
            // Convert severity from swift-log's enum to opentelemetry's enum
            var severity: OpenTelemetryApi.Severity = .debug
            switch level {
            case .critical:
                severity = .fatal
            case .debug:
                severity = .debug
            case .error:
                severity = .error
            case .info:
                severity = .info
            case .notice:
                severity = .info2
            case .trace:
                severity = .trace
            case .warning:
                severity = .warn
            }
            
            self.eventProvider.logRecordBuilder()
                .setAttributes(attributes)
                .setSeverity(severity)
                .setObservedTimestamp(Date.now)
                .setBody(AttributeValue(message.description))
                .emit()
    }
    
    // Copied from the built-in OtlpLogExporter, except with Gzip compression specified
    public class GzippedOtlpLogExporter: LogRecordExporter {
        let channel: GRPCChannel
        var logClient: Opentelemetry_Proto_Collector_Logs_V1_LogsServiceNIOClient
        let config: OtlpConfiguration
        var callOptions: CallOptions

        public init(channel: GRPCChannel,
                    config: OtlpConfiguration = OtlpConfiguration(),
                    logger: Logging.Logger = Logging.Logger(label: "io.grpc", factory: { _ in SwiftLogNoOpLogHandler() }),
                    envVarHeaders: [(String, String)]? = EnvVarHeaders.attributes) {
            self.channel = channel
            logClient = Opentelemetry_Proto_Collector_Logs_V1_LogsServiceNIOClient(channel: channel)
            self.config = config
            let userAgentHeader = (Constants.HTTP.userAgent, Headers.getUserAgentHeader())
            if let headers = envVarHeaders {
                var updatedHeaders = headers
                updatedHeaders.append(userAgentHeader)
                callOptions = CallOptions(
                    customMetadata: HPACKHeaders(updatedHeaders),
                    messageEncoding: .enabled(ClientMessageEncoding.Configuration(forRequests: .gzip, decompressionLimit: .ratio(100))),
                    logger: logger
                )
            } else if let headers = config.headers {
                var updatedHeaders = headers
                updatedHeaders.append(userAgentHeader)
                callOptions = CallOptions(
                    customMetadata: HPACKHeaders(updatedHeaders),
                    messageEncoding: .enabled(ClientMessageEncoding.Configuration(forRequests: .gzip, decompressionLimit: .ratio(100))),
                    logger: logger
                )
            } else {
                var headers = [(String, String)]()
                headers.append(userAgentHeader)
                callOptions = CallOptions(
                    customMetadata: HPACKHeaders(headers),
                    messageEncoding: .enabled(ClientMessageEncoding.Configuration(forRequests: .gzip, decompressionLimit: .ratio(100))),
                    logger: logger
                )
            }
        }

        public func export(logRecords: [ReadableLogRecord], explicitTimeout: TimeInterval? = nil) -> ExportResult {
            let logRequest = Opentelemetry_Proto_Collector_Logs_V1_ExportLogsServiceRequest.with { request in
                request.resourceLogs = LogRecordAdapter.toProtoResourceRecordLog(logRecordList: logRecords)
            }
            let timeout = min(explicitTimeout ?? TimeInterval.greatestFiniteMagnitude, config.timeout)
            if timeout > 0 {
                callOptions.timeLimit = TimeLimit.timeout(TimeAmount.nanoseconds(Int64(timeout.toNanoseconds)))
            }

            let export = logClient.export(logRequest, callOptions: callOptions)
            do {
                _ = try export.response.wait()
                return .success
            } catch {
                return .failure
            }
        }

        public func shutdown(explicitTimeout: TimeInterval? = nil) {
            _ = channel.close()
        }

        public func forceFlush(explicitTimeout: TimeInterval? = nil) -> ExportResult {
            .success
        }
    }
}
```

I also had to add the following packages:
* https://github.com/open-telemetry/opentelemetry-swift, 1.9.2
* https://github.com/grpc/grpc-swift.git, 1.23.0

This code also uses [swift-log](https://github.com/apple/swift-log) to provide a consistent [interface for logging callsites](https://apple.github.io/swift-log/docs/current/Logging/Structs/Logger.html). This lets me use this code like this:

```swift
OTLog.default().debug(
    "triggerSearch: attempting to find an active Xcode window",
    metadata: [
        "frontmostApp": "\(String(describing: frontmostApp.bundleIdentifier))",
        "focusedWindow": "\(String(describing: appElement.focusedWindow))",
        "focusedWindowRect": "\(String(describing: appElement.focusedWindow?.rect?.debugDescription))",
        "focusedWindowIdentifier": "\(String(describing: appElement.focusedWindow?.identifier))"
    ]
)
```

There's a few important aspects of this code that were key to getting things working:

1. opentelemetry-swift depends on grpc-swift, but in my setup, grcp-swift wasn't automatically installed. I'm not sure why. When I tried building documentation, the `import GRPC` line errored with "Missing required module CGRPCZlib". Manually adding the grpc-swift package to my project fixed the error.
2. Although opentelemetry-swift is one package, it outputs many targets, all of which (that you're using) need to be imported.
3. Setting an API key via an `authorization` header happens via an initializer parameter several data models down. I had to dig into opentelemetry-swift's source to figure out the right place to set headers.
4. Finally, I found an optional parameter on `ClientConnection.Configuration` that allowed me to enable TLS, which is required for getting through [App Transport Security](https://developer.apple.com/documentation/security/preventing_insecure_network_connections?language=objc). Without this, trying to send logs would (by default) silently fail, or (with some internal logging) print a timeout error: `io.grpc : error=RPC timed out before completing`. 

It felt great to see my first log line show up!
![First log line in HyperDX.](https://files.tanagram.app/file/tanagram-data/prod-feifans-blog/streaming-logs-in-swift-to-the-cloud/first-log.png)

I'm not an expert in any of this though, and it's entirely possible I've done something wrong or misunderstood something. Please let me know if you have any suggestions or improvements.