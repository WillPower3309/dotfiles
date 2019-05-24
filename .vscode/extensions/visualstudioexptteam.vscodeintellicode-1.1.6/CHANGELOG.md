# Change Log
## [1.1.6]
- Improve workflow for acquiring missing dependent extensions for Python and Java
- Fix NullPointerException which broke completions in some Java scenarios
- Remove Preview branding and change publisher from Microsoft DevLabs to Microsoft

## [1.1.5]
- Fix Javadoc and initializer completion when IntelliCode is enabled
- Support upcoming versions of Microsoft Python Language Server

## [1.1.4]
- Fix race condition in Python activation that would occasionally result in an error
- Webpack extension sources to reduce extension size and load time
- Automatically set editor.suggestSelection to 'first' when it is set to 'recentlyUsed', instead of providing per-language defaults that are difficult to override. This will make it easier to use 'recentlyUsedByPrefix' with IntelliCode.

## [1.1.3]
- Activate IntelliCode extension for React files (.tsx and .jsx)
- Add `vsintellicode.typescript.completionsEnabled` setting which can be used to configure whether IntelliCode completions are enabled for TypeScript and JavaScript-based files (.js, .jsx, .ts, .tsx)
- Bug fixes for Java IntelliCode suggestions
 
## [1.1.2]

- Clean up unnecessary dependencies
- Update ThirdPartyNotice.txt

## [1.1.1]

- Updated model delivery service calls to match IntelliCode for Visual Studio
- Fix issue in Java IntelliCode support which caused fewer augmented completions in some situations
- Miscellaneous fixes to usage telemetry

## [1.1.0]

- Added support for TypeScript/JavaScript. [Read more on the Visual Studio Blog](https://aka.ms/vsicblog).

## [1.0.6]

- Added support for Java! [Read more on the Visual Studio Blog](https://aka.ms/vsicjava).
- Fixed issues that caused IntelliCode to not augment completions for Python
- Update version of `vscode-extension-telemetry` to 0.1.0

## [1.0.5]

- Fixed issue that caused IntelliCode to intermittently not load for Python due to startup synchronization issues
- Fixed issue that caused IntelliCode extension to stop offering completions for Python
- Update version of `vscode-extension-telemetry` to 0.0.22

## [1.0.4]

- Miscellaneous bug fixes & improvements

## [1.0.3]

- Show IntelliCode completions when assigning to multiple variables simultaneously
- Fix some literal types not showing IntelliCode completions

## [1.0.2]

- Added 'vsintellicode.python.completionsEnabled' setting which can be used to configure whether IntelliCode completions are enabled.

## [1.0.1]

- Initial release
