# Welcome to punch-visualcode-plugin

Provide punchlang code assistance to visual code editor.

## Quick Start

1. Intall the extension
   
   ```bash
   cd $HOME/.vscode/extensions/
   git clone https://gitlab.thalesdigital.io/punch/parsers/punch-visualcode-plugin.git
   cd punch-visualcode-plugin
   npm install
   npm run vscode:prepublish
   ```

2. You may need to reopen your VSCode

3. Extension is activated when you first access a Punch file

## Update

1. Update the extensiona
   
   ```bash
   cd $HOME/.vscode/extensions/
   git pull
   cd punch-visualcode-plugin
   npm install
   npm run vscode:prepublish
   ```

2. You may need to reopen your VSCode

3. Extension is activated when you first access a Punch file

## Prerequisites

- npm 

- nodejs

- Python >= 3.6.8 ([Properly install Python using Pyenv](https://gitlab.thalesdigital.io/punch/product/punch/-/blob/8.0/documentation/docs/Common/Contribution_Guide/Developper/Setup/Setup_Python.md))

- VsCode >= 1.69.2 ([Properly install VsCode](https://code.visualstudio.com/download))

- Remove all settings already assign to punch files (File/Preferences/Settings)

## Features

- Syntax Highlight

- Snippets for Punch operators

- Snippets for Java 

- Punch file formatter

- Run Test annotation 

- Create Untitled Punch file

- Create Untitled Punch class file

## ShortCuts

- `"F7"` : [@Test annotation](https://punch-1.gitbook.io/punch-doc/punchlang/overview/getting-started#the-test-annotation)

- `"F2"` : Create Untitled Punch file

- `"F4"` : Create Untitled Punch class file

- `"ctrl + shift + I"` : format document

- `"ctrl + shift + P" + Format Document` : format document

- `"ctrl + shift + P" + Create New Punchlet`  : open new Untitled Punch file

- `"ctlr + shift + /"` : comment selected lines or current line (if no selected)

**Remark :**

   `"ctrl + shift + P"` command is equivalent to  `"F1"`

## List Snippets Punch Operators

- cef

- cidrmatch

- csv

- findByKey

- grok2

- kv

- print

- raise

- tuple

## Extension Settings

This extension contributes the following settings :

- *Punch-formatter: Indentwidth* : number of spaces used for indentation (default = 1)

- *Punch-formatter: Python Path* : optional custom path to python executable (requires restarting vscode)

- *Punch-formatter: Formatter Path* : optional custom path to punch formatter (requires restarting vscode)

- *Punch-puncher: Puncher Tag* : Puncher docker image tag

## License

All PunchPlatform software, documentation, resources are Copyright (c) Thales Services SAS, France 2015-2021. All rights reserved
