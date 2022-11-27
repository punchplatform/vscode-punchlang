#!/usr/bin/env python3
import re
import sys


class Formatter:
    # control sequences
    line_comment = re.compile(r'(^|\s*)\/\/.*$')

    # indentation
    ilvl = 0
    iwidth = 0
    isString = (False, '\"')

    def __init__(self, indentwidth):
        self.iwidth = indentwidth

    def multiple_semicolon(self, line, semicolon):
        result = self.indent() + line[0:semicolon[0].span()[1]]
        for i in range(0,len(semicolon)-1):
            result += '\n' + self.indent() +  line[semicolon[i].span()[1]:semicolon[i+1].span()[1]].strip()
        return(0,  result)

    # compute indentation
    def indent(self, add=0):
        if self.iwidth == 0 :
            self.iwidth = 1
        return (self.ilvl)*self.iwidth*' '

    def formatLine(self, line):
        line = line.strip()
        # determine if line is a line comment 
        if re.match(self.line_comment, line):
            return (0, self.indent() + line.strip())

        # get all ", ', {, }, for and ; in the current line 
        find_all_element = [m for m in re.finditer(r'\"|\'|{|}|;|\s*for\s*\(',line)]
        list_for = []

        # search if there is any for statement
        for i in range(0, len(find_all_element)-1) :
            if(find_all_element[i][0] == 'for (') :
                list_for.append(i)

        # remove the 2 next ; if there is for
        for e in list_for:
            del find_all_element[e:e+3]

        # return indent line if no special charater
        if (len(find_all_element) < 1): 
            return (0, self.indent() + line.strip())

        # return indent line if 1 special charater and maj ident
        if (len(find_all_element) == 1): 
            if find_all_element[0][0] == '{' :
                return (4, self.indent() + line.strip())
            if find_all_element[0][0] == '}' :
                self.ilvl -= 4
            return (0, self.indent() + line.strip())

        # format if there more than on special charater
        result = self.indent() + line[0:find_all_element[0].span()[1]]
        for i in range(0, len(find_all_element)-1)  :
            if self.isString == (True, find_all_element[i][0]):
                self.isString = (False, self.isString[1])
                result += line[find_all_element[i].span()[1]:find_all_element[i+1].span()[1]]
                continue

            if find_all_element[i][0] == '\"' or find_all_element[i][0] == '\'':
                self.isString = (True, find_all_element[i][0])
                result += line[find_all_element[i].span()[1]:find_all_element[i+1].span()[1]]
                continue

            if self.isString[0] == True : 
                result += line[find_all_element[i].span()[1]:find_all_element[i+1].span()[1]]
                continue

            if find_all_element[i][0] =='{' :
                self.ilvl += 4
                result += '\n' + self.indent() +line[find_all_element[i].span()[1]:find_all_element[i+1].span()[1]].strip()

            if find_all_element[i][0] ==';' :
                if find_all_element[i+1][0] == '}' :
                    self.ilvl -= 4
                result += '\n' + self.indent() +line[find_all_element[i].span()[1]:find_all_element[i+1].span()[1]].strip()

            if find_all_element[i][0] =='}' :
                self.ilvl -= 4
                result += '\n' + self.indent() +line[find_all_element[i].span()[1]:find_all_element[i+1].span()[1]].strip()
        
        result = result + line[find_all_element[len(find_all_element)-1].span()[1] : len(line)]
        if find_all_element[len(find_all_element)-1][0] == '{' :
                self.ilvl += 4
        if find_all_element[len(find_all_element)-1][0] == '}' :
                self.ilvl -= 4

        return (0, result)
        


    # format file from line 'start' to line 'end'
    def formatFile(self, filename, start, end):
        # read lines from file
        wlines = rlines = []

        if filename == '-':
            with sys.stdin as f:
                rlines = f.readlines()[start-1:end]
        else:
            with open(filename, 'r', encoding='UTF-8') as f:
                rlines = f.readlines()[start-1:end]

        # take care of empty input
        if not rlines:
            rlines = ['']

        # get initial indent lvl
        self.ilvl = 0

        blank = True
        for line in rlines:
            # format line
            (offset, line) = self.formatLine(line)
            self.ilvl += offset

            # add line to result
            wlines.append(line)

        # remove last line if blank
        while wlines and not wlines[-1]:
            wlines.pop()

        # take care of empty output
        if not wlines:
            wlines = ['']

        # write output
        for line in wlines:
            print(line)


def main():
    options = dict(startLine=1, endLine=None, indentWidth=4)
    if len(sys.argv) < 2:
        print('Missing arguments', file=sys.stderr)

    else:
        for arg in sys.argv[2:]:
            key, value = arg.split('=')
            if any(char.isdigit() for char in value):
                value = int(value)
            options[key.strip()] = value

        indent = options['--indentWidth']
        start = options['--startLine']
        end = options['--endLine']

        formatter = Formatter(indent)
        formatter.formatFile(sys.argv[1], start, end)


if __name__ == '__main__':
    main()