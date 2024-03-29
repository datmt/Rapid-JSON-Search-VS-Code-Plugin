# JSON Search for values quickly

JSON search plugin lets you search quickly for the value of JSON object in _currently_ open file.

## Why another JSON plugin?

This JSON search plugin comes from my actual needs. I usually have to search for translation string in JSON files. I don't know how to locate
the path to the JSON value I need. As a result, I spent a lot of time filtering through my JSON files manually.

## What does this JSON search plugin offer?

What this JSON search plugin does is very simple. You enter a full path or a part of a full part, it will search for the matches paths in your
_currently open_ JSON file. You may not find the exact key you search for but the are suggestions of matched JSON paths you can try.

## How it works

1. Cmd +p, type > Rapid JSON Search: Create to open the terminal
2. Type in the path for example person.name
3. Hit enter to see the result

## Commands

1. `:clear` to clear the terminal
2. `:kaput` to destroy the terminal
3. `:reload` reload the currently open file

## License

MIT

## Contact

Ping me at dat.tm24@gmail.com or visit my website at [Datmt](https://www.datmt.com/?src=vscode-mktpl)

![rapid-json-search](https://user-images.githubusercontent.com/14150061/78463059-e68f1c80-7702-11ea-8bd6-2c03fb856969.gif)
