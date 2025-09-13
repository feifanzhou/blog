---
title: How to Use SourceKit-LSP
date: '2023-03-05'
updated: '2023-03-05'
slug: how-to-use-sourcekit-lsp
excerpt: >-
  Background: I'm building Tanagram, a tool to browse and edit code like a
  relational database (instead of text files). I'm using SourceKit-LSP to
  implement code-understanding for Swift. There was very...
---


Background: I'm building [Tanagram](https://twitter.com/tanagram_/), a tool to browse and edit code like a relational database (instead of text files). I'm using [SourceKit-LSP](https://github.com/apple/sourcekit-lsp) to implement code-understanding for Swift. There was very little documentation on how to actually use SourceKit-LSP when I started, and it took a lot of trial-and-error to get it working. This post is the "how-to" guide I wish I had. This is current as-of macOS Ventura 13.1, Xcode 14.2, and SourceKit-LSP commit `99bae51`.

Tanagram starts by [loading all the items](https://twitter.com/tanagram_/status/1596962385721376768?s=61&t=o_O-IyynfYTKvYYXidk1mw) ("symbols") in a codebase, and then provides a GUI around them. It uses the `workspace/symbol` [LSP request](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#workspace_symbol) to get all the symbols from a language server, which is SourceKit-LSP in the case of a Swift codebase (there's some limitations of how this request is implemented in SourceKit-LSP, which I'll get into below). The main thing that took me a while to figure out was why SourceKit-LSP was returning an empty array in its response to `workspace/symbol`. The short answer is that I had to disable the `minWorkspaceSymbolPatternLength` check, create a compilation database, and fix the default file extension for `libIndexStore`. For the long answer, keep reading.

# Running SourceKit-LSP
Tanagram itself is written in Swift, so I needed to write Swift code to interact with SourceKit-LSP. However, upon getting empty results and exhausting my easy ideas for fixing it, I created a new project to isolate the language-server code. I initially tried to create a "Command Line Tool" in Xcode, but Command Line Tools exit after running their main code (e.g. sending a request to a SourceKit-LSP sub-process) and I didn't want to figure out how to keep the main process alive long enough to receive a response, so I switched to a SwiftUI app.

Running `xcrun --find sourcekit-lsp` shows that the `sourcekit-lsp` binary is at `/Library/Developer/CommandLineTools/usr/bin/sourcekit-lsp` on my computer. In Swift, use  [`Process`](https://developer.apple.com/documentation/foundation/process) to run this binary as a sub-process and [`Pipe`](https://developer.apple.com/documentation/foundation/pipe) to get access to its stdin, stdout, and stderr. SourceKit-LSP accepts requests on stdin, sends responses to those requests on stdout, and sends logging and debugging output to stderr. This is the code I used to create the sub-process:

```swift
// Create and configure the sub-process
self.serverProcess = Process()
serverProcess.executableURL = URL(filePath: "/Library/Developer/CommandLineTools/usr/bin/sourcekit-lsp", directoryHint: .notDirectory)
serverProcess.arguments = ["--log-level", "debug"]
serverProcess.qualityOfService = .userInteractive
// Set current-working-directory to the directory of the codebase I want to browse
// I'm not sure if this is necessary, but likely doesn't hurt.
serverProcess.currentDirectoryURL = URL(fileURLWithPath: "/Users/feifan/Developer/tanagram/src/Visualize")

// Get access to stdin, stdout, and stderr
self.stdinPipe = Pipe()
serverProcess.standardInput = stdinPipe
self.stdoutPipe = Pipe()
serverProcess.standardOutput = stdoutPipe
stdoutPipe.fileHandleForReading.waitForDataInBackgroundAndNotify()
NotificationCenter.default.addObserver(
    forName: NSNotification.Name.NSFileHandleDataAvailable,
    object: stdoutPipe.fileHandleForReading,
    queue: nil,
    using: self.handleStdoutOutput(fromNotification:)
)
self.stderrPipe = Pipe()
serverProcess.standardError = stderrPipe
stderrPipe.fileHandleForReading.waitForDataInBackgroundAndNotify()
NotificationCenter.default.addObserver(
    forName: NSNotification.Name.NSFileHandleDataAvailable,
    object: stderrPipe.fileHandleForReading,
    queue: nil,
    using: self.handleStderrOutput(fromNotification:)
)

// Actually start the sub-process
try! serverProcess.run()
print("Running with PID \(serverProcess.processIdentifier)")
```

`handleStdoutOutput` looks like this (and `handleStderrOutput` is similar):
```swift
private func handleStdoutOutput(fromNotification notification: Notification) {
    guard let handle = notification.object as? FileHandle else { return }
    let data = handle.availableData
    if data.count > 0 {
        if let str = String(data: data, encoding: .utf8) {
            print("[SourceKit-LSP stdout] \(str)\n\n")
        } else {
            print("[SourceKit-LSP stdout] Got data, but couldn't convert it into a string\n\n")
        }
    } else {
        print("[SourceKit-LSP stdout] Reached end of input\n\n")
    }
    // In my testing, waitForDataInBackgroundAndNotify fires once (the next time there's data),
    // and not again. So in the notification handler, I call it again
    // to, effectively, loop the listener.
    self.stdoutPipe.fileHandleForReading.waitForDataInBackgroundAndNotify()
}
```

I verified that SourceKit-LSP was actually running by sending it an `initialize` request, and seeing that I got a valid response back. Sending a request looks like this:
```swift
let initEnvelope = lspayload(id: 100000, method: "initialize", params: [
    "processId": nil,
    "rootUri": "file:///Users/feifan/Developer/tanagram/src/Visualize",
    "capabilities": [
        "workspace": [:],
        "window": [
            "workDoneProgress": true
        ],
        "general": [
            "positionEncodings": ["utf-8"]
        ]
    ]
])
try! stdinPipe.fileHandleForWriting.write(contentsOf: initEnvelope.data(using: .utf8)!)

private func lspayload(id: UInt, method: String, params: [String: Any?]) -> String {
    let messageDictionary: [String: Any] = [
        "jsonrpc": "2.0",
        "id": id,
        "method": method,
        "params": params
    ]
    let jsonData = try! JSONSerialization.data(withJSONObject: messageDictionary, options: [])
    let jsonString = String(data: jsonData, encoding: .utf8)!
    let envelope = "Content-Length: \(jsonData.count)\r\n\r\n\(jsonString)"
    return envelope
}
```

However, when I tried sending a `workspace/symbol` request, I couldn't get it to return anything other than an empty array in the response. To figure out what was going on:
1. I downloaded SourceKit-LSP's source from Github,
2. Added a log line (via `Logger.shared.log`) to its [entry point](https://github.com/apple/sourcekit-lsp/blob/24ce1bec10a13abf424a15a71fc2c63d8c6bb8f1/Sources/sourcekit-lsp/SourceKitLSP.swift#L209),
3. Built it in Xcode and opened the output folder ("Show Build Folder in Finder" menu item),
4. Used the `sourcekit-lsp` binary in _that_ folder (on my computer, the path is `/Users/feifan/Library/Developer/Xcode/DerivedData/sourcekit-lsp-aboxbvmwqocpepaknzrqeqgirufj/Build/Products/Debug/sourcekit-lsp`),
5. [Remove the App Sandbox](https://github.com/apple/sourcekit-lsp/blame/main/Documentation/Client_Development.md#L10) in my sample project (select the `.xcodeproj` in the Project navigator and go to "Signing & Capabilities") — otherwise, I'd get a "file not found" error,
6. And ran my sample project again to see the log line I added show up in the Xcode console.

I could now add log lines anywhere I wanted in the SourceKit-LSP source to help me figure out what's going on, re-build `sourcekit-lsp` in Xcode (the build output folder didn't change in my testing), and then relaunch my sample project.

# Making SourceKit-LSP Return Results
The implementation for LSP methods starts in the `SourceKitServer.swift` file — [here's the code](https://github.com/apple/sourcekit-lsp/blob/24ce1bec10a13abf424a15a71fc2c63d8c6bb8f1/Sources/SourceKitLSP/SourceKitServer.swift#L1041-L1065) for `workspace/symbol` requests.

It calls the [`findWorkspaceSymbols(matching:)` method](https://github.com/apple/sourcekit-lsp/blob/24ce1bec10a13abf424a15a71fc2c63d8c6bb8f1/Sources/SourceKitLSP/SourceKitServer.swift#L1006-L1039), and here I find my first project: the [`minWorkspaceSymbolPatternLength` guard](https://github.com/apple/sourcekit-lsp/blob/24ce1bec10a13abf424a15a71fc2c63d8c6bb8f1/Sources/SourceKitLSP/SourceKitServer.swift#L1014) (this value [is currently `3`](https://github.com/apple/sourcekit-lsp/blob/24ce1bec10a13abf424a15a71fc2c63d8c6bb8f1/Sources/SourceKitLSP/SourceKitServer.swift#L1751-L1753)). Since I want to load _all_ symbols, I removed this condition in my local build.

Next, after a bunch of log lines, I figured out that [`workspace.index?`](https://github.com/apple/sourcekit-lsp/blob/24ce1bec10a13abf424a15a71fc2c63d8c6bb8f1/Sources/SourceKitLSP/SourceKitServer.swift#L1019) was `nil` for two reasons.

The first reason is that I need to have a `compile_commands.json` file in the root of the codebase I wanted to analyze. This file is a [compilation database](https://www.jetbrains.com/help/clion/compilation-database.html) listing commands that were used to compile the project. Specifically, SourceKit-LSP looks for the first command that [contains an `-index-store-path` parameter](https://github.com/apple/sourcekit-lsp/blob/ce24416af2bb226810f314a84d7e4019ec18c8b4/Sources/SKCore/CompilationDatabaseBuildSystem.swift#L68), which is supposed to point to an `IndexStoreDB` that is [created/updated at build-time](https://github.com/apple/sourcekit-lsp#indexing-while-building). To get this minimally working, I copied some build output from `xcodebuild clean build -project Visualize.xcodeproj -scheme Visualize | tee last_build.log`, and manually created a `compile_commands.json` file, which looked like this:
```json
[
	{
		"directory": "/Users/feifan/Developer/tanagram/src/Visualize",
		"command": "/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/swift-frontend -c /Users/feifan/Developer/tanagram/src/Visualize/Visualize/Array+Move.swift <SNIP> -index-store-path /Users/feifan/Library/Developer/Xcode/DerivedData/Visualize-btsxhyyrvfibcbedigiqvajgduqa/Index.noindex/DataStore -index-system-modules",
		"file": "/Users/feifan/Developer/tanagram/src/Visualize/Visualize/SourceKitLSPClient.swift"
	}
]
```

To make this production-ready, it looks like I could [parse `*.xcbuild` files](https://forums.swift.org/t/xcode-project-support/20927/6) instead of the full `xcodebuild` output. It also looks like SourceKit-LSP itself can take an [`-index-store-path` parameter](https://github.com/apple/sourcekit-lsp/blob/f5a30d9351e9b264c65c0290210edd536f9159ed/Sources/sourcekit-lsp/SourceKitLSP.swift#L115-L119),  so maybe I can skip the intermediate step of creating the `compile_commands.json` file, although I haven't tested this myself yet.

The second reason was because of an error message that I didn't pay much attention to at first:

```sh
[SourceKit-LSP stderr] [2023-02-23 18:55:07.600] Could not determine host OS. Falling back to using '.so' as dynamic library extension
```

SourceKit-LSP t couldn't [automatically determine](https://github.com/apple/sourcekit-lsp/blob/effcb1c20aa3e0c8d08e607ba58f942082800006/Sources/SKCore/Toolchain.swift#L165-L170) the right file extension for `libIndexStore` (the library for using `IndexStoreDB`) — on macOS, it's supposed to be `.dylib`, but it was defaulting to `.so`. I don't know why `Platform.current?` wasn't working; I worked around it by changing the SourceKit-LSP source in my local build to default to `.dylib`.

With those changes, I was able to get a non-empty set of results for my `workspace/symbol` request!

## Buffering output
SourceKit-LSP sends response over stdout in chunks that don't align with message boundaries, so I have to buffer the output and extract valid responses. My code for doing so looks like this:
```swift
import Foundation

class LanguageServerResponseBuffer {
    var messagesHandler: ([String]) -> Void
    private var buffer: String = ""
    
    init(messagesHandler: @escaping ([String]) -> Void) {
        self.messagesHandler = messagesHandler
    }
    
    func append(fragment: String) {
        buffer.append(fragment)
        self.processBuffer()
    }
    
    private func processBuffer() {
        guard self.buffer != "" else { return }
        // Assume that the buffer starts at the beginning of a response envelope
        // (e.g. starting with Content-Length)
        // TODO: Consider raising an error
        guard self.buffer.hasPrefix("Content-Length:") else {
            print("Don't know what to do with buffer because it doesn't start with `Content-Length:'")
            return
        }

        var offset = 0
        var bodies: [String] = []
        let bufferLength = self.buffer.lengthOfBytes(using: .utf8)
        while offset < bufferLength {
            // Peek at Content-Length to see if it would go beyond the end of the current buffer
            var peekingOffset = offset
            peekingOffset += 16 // Length of "Content-Length: "
            var contentLengthString = ""
            var currentChar = self.buffer[String.Index(utf16Offset: peekingOffset, in: self.buffer)]
            while currentChar.isNumber {
                contentLengthString.append(currentChar)
                peekingOffset += 1
                currentChar = self.buffer[String.Index(utf16Offset: peekingOffset, in: self.buffer)]
            }
            let contentLength = Int(contentLengthString)!
            peekingOffset += 4 // "\r\n\r\n" between header and body
            let endPosition = peekingOffset + contentLength
            if endPosition <= bufferLength {
                // End position is within bounds of the current buffer; collect the next body…
                let bodyStartIndex = String.Index(utf16Offset: peekingOffset, in: self.buffer)
                let bodyEndIndex = String.Index(utf16Offset: endPosition, in: self.buffer)
                let substring = self.buffer[bodyStartIndex..<bodyEndIndex]
                bodies.append(String(substring))
                // … and advance offset (peekingOffset doesn't matter at this point in the loop)
                offset = endPosition
            } else {
                // End position is beyond the end of the current buffer; stop looping.
                break
            }
        }
        // I actually don't know why 2 is the magic number here, but it makes test cases work …
        let dropFirst = offset == 0 ? 0 : offset - 2
        self.buffer = String(self.buffer.dropFirst(dropFirst))
        self.messagesHandler(bodies)
    }
}
```

This code might have bugs! I've tested it with the following test cases though:
```swift
import XCTest

final class LanguageServerResponseBufferTests: XCTestCase {
    func testSingleCompleteMessage() {
        let completeFragment = "Content-Length: 124\r\n\r\n{\"jsonrpc\":\"2.0\",\"method\":\"window/workDoneProgress/create\",\"params\":{\"token\":\"56afc7cb-295c-4812-8dbd-8e07c9d1a482\"},\"id\":1}"
        var bodies: [String] = []
        let messagesHandler: ([String]) -> Void = {
            bodies.append(contentsOf: $0)
        }
        let buffer = LanguageServerResponseBuffer(messagesHandler: messagesHandler)
        buffer.append(fragment: completeFragment)
        XCTAssertEqual(bodies, ["{\"jsonrpc\":\"2.0\",\"method\":\"window/workDoneProgress/create\",\"params\":{\"token\":\"56afc7cb-295c-4812-8dbd-8e07c9d1a482\"},\"id\":1}"])
    }
    
    func testMultipleCompleteMessages() {
        let completeFragments = "Content-Length: 124\r\n\r\n{\"jsonrpc\":\"2.0\",\"method\":\"window/workDoneProgress/create\",\"params\":{\"token\":\"56afc7cb-295c-4812-8dbd-8e07c9d1a482\"},\"id\":1}Content-Length: 527\r\n\r\n{\"jsonrpc\":\"2.0\",\"id\":\"1\",\"result\":{\"capabilities\":{\"textDocumentSync\":2,\"workspace\":{\"workspaceFolders\":{\"supported\":true,\"changeNotifications\":true}},\"completionProvider\":{\"resolveProvider\":true,\"triggerCharacters\":[\".\",\":\",\"@\"]},\"signatureHelpProvider\":{\"triggerCharacters\":[\"(\",\",\"]},\"hoverProvider\":true,\"documentSymbolProvider\":true,\"definitionProvider\":true,\"renameProvider\":{\"prepareProvider\":true},\"referencesProvider\":true,\"workspaceSymbolProvider\":true,\"foldingRangeProvider\":true,\"documentHighlightProvider\":true}}}"
        var bodies: [String] = []
        let messagesHandler: ([String]) -> Void = {
            bodies.append(contentsOf: $0)
        }
        let buffer = LanguageServerResponseBuffer(messagesHandler: messagesHandler)
        buffer.append(fragment: completeFragments)
        XCTAssertEqual(
            bodies,
            [
                "{\"jsonrpc\":\"2.0\",\"method\":\"window/workDoneProgress/create\",\"params\":{\"token\":\"56afc7cb-295c-4812-8dbd-8e07c9d1a482\"},\"id\":1}",
                "{\"jsonrpc\":\"2.0\",\"id\":\"1\",\"result\":{\"capabilities\":{\"textDocumentSync\":2,\"workspace\":{\"workspaceFolders\":{\"supported\":true,\"changeNotifications\":true}},\"completionProvider\":{\"resolveProvider\":true,\"triggerCharacters\":[\".\",\":\",\"@\"]},\"signatureHelpProvider\":{\"triggerCharacters\":[\"(\",\",\"]},\"hoverProvider\":true,\"documentSymbolProvider\":true,\"definitionProvider\":true,\"renameProvider\":{\"prepareProvider\":true},\"referencesProvider\":true,\"workspaceSymbolProvider\":true,\"foldingRangeProvider\":true,\"documentHighlightProvider\":true}}}"
            ]
        )
    }
    
    func testSinglePartialMessage() {
        let fragment1 = "Content-Length: 124\r\n\r\n{\"jsonrpc\":\"2.0\",\"met"
        let fragment2 = "hod\":\"window/workDoneProgress/create\",\"params\":{\"token\":\"56afc7cb-295c-4812-8dbd-8e07c9d1a482\"},\"id\":1}"
        var bodies: [String] = []
        let messagesHandler: ([String]) -> Void = {
            bodies.append(contentsOf: $0)
        }
        let buffer = LanguageServerResponseBuffer(messagesHandler: messagesHandler)
        buffer.append(fragment: fragment1)
        XCTAssertEqual(bodies, [])
        buffer.append(fragment: fragment2)
        XCTAssertEqual(bodies, ["{\"jsonrpc\":\"2.0\",\"method\":\"window/workDoneProgress/create\",\"params\":{\"token\":\"56afc7cb-295c-4812-8dbd-8e07c9d1a482\"},\"id\":1}"])
    }
    
    func testTwoPartialMessages() {
        let fragment1 = "Content-Length: 124\r\n\r\n{\"jsonrpc\":\"2.0\",\"method\":\"window/workDone"
        let fragment2 = "Progress/create\",\"params\":{\"token\":\"56afc7cb-295c-4812-8dbd-8e07c9d1a482\"},\"id\":1}Content-Length: 527\r\n\r\n{\"jsonrpc\":\"2.0\",\"id\":\"1\",\"result\":{\"capabi"
        let fragment3 = "lities\":{\"textDocumentSync\":2,\"workspace\":{\"workspaceFolders\":{\"supported\":true,\"changeNotifications\":true}},\"completionProvider\":{\"resolveProvider\":true,\"triggerCharacters\":[\".\",\":\",\"@\"]},\"signatureHelpProvider\":{\"triggerCharacters\":[\"(\",\",\"]},\"hoverProvider\":true,\"documentSymbol"
        let fragment4 = "Provider\":true,\"definitionProvider\":true,\"renameProvider\":{\"prepareProvider\":true},\"referencesProvider\":true,\"workspaceSymbolProvider\":true,\"foldingRangeProvider\":true,\"documentHighlightProvider\":true}}}"
        var bodies: [String] = []
        let messagesHandler: ([String]) -> Void = {
            bodies.append(contentsOf: $0)
        }
        let buffer = LanguageServerResponseBuffer(messagesHandler: messagesHandler)
        buffer.append(fragment: fragment1)
        XCTAssertEqual(bodies, [])
        buffer.append(fragment: fragment2)
        XCTAssertEqual(bodies,
           ["{\"jsonrpc\":\"2.0\",\"method\":\"window/workDoneProgress/create\",\"params\":{\"token\":\"56afc7cb-295c-4812-8dbd-8e07c9d1a482\"},\"id\":1}"]
        )
        buffer.append(fragment: fragment3)
        XCTAssertEqual(bodies,
           ["{\"jsonrpc\":\"2.0\",\"method\":\"window/workDoneProgress/create\",\"params\":{\"token\":\"56afc7cb-295c-4812-8dbd-8e07c9d1a482\"},\"id\":1}"]
        )
        buffer.append(fragment: fragment4)
        XCTAssertEqual(
            bodies,
            [
                "{\"jsonrpc\":\"2.0\",\"method\":\"window/workDoneProgress/create\",\"params\":{\"token\":\"56afc7cb-295c-4812-8dbd-8e07c9d1a482\"},\"id\":1}",
                "{\"jsonrpc\":\"2.0\",\"id\":\"1\",\"result\":{\"capabilities\":{\"textDocumentSync\":2,\"workspace\":{\"workspaceFolders\":{\"supported\":true,\"changeNotifications\":true}},\"completionProvider\":{\"resolveProvider\":true,\"triggerCharacters\":[\".\",\":\",\"@\"]},\"signatureHelpProvider\":{\"triggerCharacters\":[\"(\",\",\"]},\"hoverProvider\":true,\"documentSymbolProvider\":true,\"definitionProvider\":true,\"renameProvider\":{\"prepareProvider\":true},\"referencesProvider\":true,\"workspaceSymbolProvider\":true,\"foldingRangeProvider\":true,\"documentHighlightProvider\":true}}}"
            ]
        )
    }
    
    func testThreePartialMessages() {
        let fragment1 = "Content-Length: 124\r\n\r\n{\"jsonrpc\":\"2.0\",\"method\":\"window/workDone"
        let fragment2 = "Progress/create\",\"params\":{\"token\":\"56afc7cb-295c-4812-8dbd-8e07c9d1a482\"},\"id\":1}Content-Length: 527\r\n\r\n{\"jsonrpc\":\"2.0\",\"id\":\"1\",\"result\":{\"capabi"
        let fragment3 = "lities\":{\"textDocumentSync\":2,\"workspace\":{\"workspaceFolders\":{\"supported\":true,\"changeNotifications\":true}},\"completionProvider\":{\"resolveProvider\":true,\"triggerCharacters\":[\".\",\":\",\"@\"]},\"signatureHelpProvider\":{\"triggerCharacters\":[\"(\",\",\"]},\"hoverProvider\":true,\"documentSymbol"
        let fragment4 = "Provider\":true,\"definitionProvider\":true,\"renameProvider\":{\"prepareProvider\":true},\"referencesProvider\":true,\"workspaceSymbolProvider\":true,\"foldingRangeProvider\":true,\"documentHighlightProvider\":true}}}Content-Length: 42\r\nr\n{\"jsonrpc\":\"2.0\",\"id\":1000002,\"result\":[]}"
        var bodies: [String] = []
        let messagesHandler: ([String]) -> Void = {
            bodies.append(contentsOf: $0)
        }
        let buffer = LanguageServerResponseBuffer(messagesHandler: messagesHandler)
        buffer.append(fragment: fragment1)
        XCTAssertEqual(bodies, [])
        buffer.append(fragment: fragment2)
        XCTAssertEqual(bodies,
           ["{\"jsonrpc\":\"2.0\",\"method\":\"window/workDoneProgress/create\",\"params\":{\"token\":\"56afc7cb-295c-4812-8dbd-8e07c9d1a482\"},\"id\":1}"]
        )
        buffer.append(fragment: fragment3)
        XCTAssertEqual(bodies,
           ["{\"jsonrpc\":\"2.0\",\"method\":\"window/workDoneProgress/create\",\"params\":{\"token\":\"56afc7cb-295c-4812-8dbd-8e07c9d1a482\"},\"id\":1}"]
        )
        buffer.append(fragment: fragment4)
        XCTAssertEqual(
            bodies,
            [
                "{\"jsonrpc\":\"2.0\",\"method\":\"window/workDoneProgress/create\",\"params\":{\"token\":\"56afc7cb-295c-4812-8dbd-8e07c9d1a482\"},\"id\":1}",
                "{\"jsonrpc\":\"2.0\",\"id\":\"1\",\"result\":{\"capabilities\":{\"textDocumentSync\":2,\"workspace\":{\"workspaceFolders\":{\"supported\":true,\"changeNotifications\":true}},\"completionProvider\":{\"resolveProvider\":true,\"triggerCharacters\":[\".\",\":\",\"@\"]},\"signatureHelpProvider\":{\"triggerCharacters\":[\"(\",\",\"]},\"hoverProvider\":true,\"documentSymbolProvider\":true,\"definitionProvider\":true,\"renameProvider\":{\"prepareProvider\":true},\"referencesProvider\":true,\"workspaceSymbolProvider\":true,\"foldingRangeProvider\":true,\"documentHighlightProvider\":true}}}",
                "{\"jsonrpc\":\"2.0\",\"id\":1000002,\"result\":[]}"
            ]
        )
    }
}
```

## De-duplicating output
I was getting duplicate symbols from SourceKit-LSP. Debug output showed that it was because it was returning an entry for each symbol in each target, and since I've added a lot of my code to both my app's target as well as my test target, many of my symbols were coming back twice. I de-duplicated them based on the `location` of each symbol.

# Getting All Symbols from SourceKit-LSP
I haven't entirely figured out how to get _all_ symbols from SourceKit-LSP. If I send an empty-string query in my `workspace/symbol` request, I get back an empty array. The query is used for a [case-insensitive match anywhere in a symbol's name](https://github.com/apple/sourcekit-lsp/blob/effcb1c20aa3e0c8d08e607ba58f942082800006/Sources/SourceKitLSP/SourceKitServer.swift#L1019-L1025). This seems to be behavior that's baked into IndexStoreDB, rather than any sort of short-circuiting in SourceKit-LSP itself. The hack I've come up with so far is making five separate requests, one for each English vowel, and aggregating all the responses. Obviously there are some symbols that this approach will miss, and it takes a while to get all the responses, but it's a start.