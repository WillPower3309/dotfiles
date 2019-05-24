# Visual Studio IntelliCode

The [Visual Studio IntelliCode](https://go.microsoft.com/fwlink/?linkid=872679) extension provides AI-assisted development features for Python, TypeScript/JavaScript and Java developers in Visual Studio Code, with insights based on understanding your code context combined with machine learning.

You'll need Visual Studio Code October 2018 Release 1.29.1 or later to use this extension. For each supported language, please refer to the "Getting Started" section below to understand any other pre-requisites you'll need to install and configure to get IntelliCode completions.

For C#, C++, TypeScript/JavaScript, and XAML support in the Visual Studio IDE, check out the [IntelliCode extension on the Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=VisualStudioExptTeam.VSIntelliCode).

## About IntelliCode

This extension provides AI-assisted IntelliSense by showing recommended completion items for your code context at the top of the completions list. The example below shows this in action for Python code.

![Python AI-enhanced IntelliSense](https://go.microsoft.com/fwlink/?linkid=2006041)

When it comes to overloads, rather than taking the time to cycle through the alphabetical list of member, IntelliCode presents the most relevant one first. In the example shown above, you can see that the predicted APIs that **IntelliCode** elevates appear in a new section of the list at the top with members prefixed by a star icon.  Similarly, a member’s signature or overloads shown in the IntelliSense tool-tip will have additional text marked by a small star icon and wording to explain the recommended status. This visual experience for members in the list and the tool-tip that **IntelliCode** provides is not intended as final – it is intended to provide you with a visual differentiation for feedback purposes only.

Contextual recommendations are based on practices developed in thousands of high quality, open-source projects on GitHub each with high star ratings. This means you get context-aware code completions, tool-tips, and signature help rather than alphabetical or most-recently-used lists. By predicting the most likely member in the list based on your coding context, AI-assisted IntelliSense stops you having to hunt through the list yourself.

## Getting Started

Install the Visual Studio IntelliCode extension by clicking the install link on this page, or install from the Extensions tab in Visual Studio Code. Then follow the language-specific instructions below.

### For TypeScript/JavaScript users:

That's it -- just open a TypeScript or JavaScript file, and start editing.

### For Python users:

1. Set up the Python extension by following the steps in the [Python tutorial](https://code.visualstudio.com/docs/python/python-tutorial#_prerequisites)

2. Start editing Python files, you should get a prompt to enable the Microsoft Python Language Server, which itself is a preview release.

3. Reload Visual Studio Code after enabling the language server

4. After the language server finishes initializing, you should now see recommended completions

### For Java users:

1. Set up the Java extension for Visual Studio Code by following the steps in the [Java Tutorial](https://code.visualstudio.com/docs/java/java-tutorial)

2. Make sure that you have a minimum of Java 8 Update 151 installed

3. Reload Visual Studio Code after enabling the Java extension

4. After the Java language server finishes initializing, you should now see recommended completions

## How do I report feedback and issues?

You can [file an issue](https://go.microsoft.com/fwlink/?linkid=2005855) on our IntelliCode for VS Code extension GitHub feedback repo.

You can also check out our [FAQ](https://go.microsoft.com/fwlink/?linkid=873429)

## Future Plans

There is much more to come -- [sign up here](https://go.microsoft.com/fwlink/?linkid=872706) for future news and updates!
