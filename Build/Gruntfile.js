const sprintf = require('sprintf-js').sprintf;

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        nodes: grunt.file.readJSON('nodes.json'),
        language: '<%= nodes.language %>',
        baseurl: '<%= nodes.baseurl %>',
        versions: '<%= nodes.versions %>',
        tables: [],
        label: {
            no: '',
            yes: ''
        },
        files: {
            linksLog: 'check-links.log',
            debugNodes: 'debug-nodes.txt',
        },
        paths: {
            root: '../',
            tmp: 'temp/',
            source: '<%= paths.root %>Source/',
            target: '<%= paths.root %>Documentation/'
        }
    });

    /**
     * Check all links defined in the RST file
     */
    grunt.registerTask('check-links-in-rst', 'Check links for Sphinx', function () {
        const exec = require('child_process').execSync;
        const linksFile = grunt.config('paths.target') + 'index.rst';
        const fileContent = grunt.file.read(linksFile);
        const lines = fileContent.split('\n');
        const regex = '(https:\/\/[^ \'´">]*)';
        let log = '';

        let nullFile = '/dev/null';
        if (isWindows) {
            nullFile = 'nul';
        }
        for (const line of lines) {
            const found = line.match(regex);
            if (found) {
                const url = found[1];
                let statusCode = '';
                try {
                    statusCode = exec('curl -s -f -o ' + nullFile + ' -w "%{http_code}" ' + url + '', { encoding: 'utf8' });
                } catch (err) {
                    statusCode = -1;
                }
                const statusPrefix = '>> ';
                let status = statusCode['green'];
                if (parseInt(statusCode) != '200') {
                    status = statusCode['yellow'];
                }
                if (parseInt(statusCode) < 0) {
                    status = '404'.red;
                    statusCode = 404;
                }
                grunt.log.writeln(statusPrefix + status + ': ' + url);
                log += '[' + statusCode + '] ' + url + '\n';
            }
        }
        // Write node labels to file
        grunt.file.write(
            grunt.config('paths.tmp') + grunt.config('files.linksLog'),
            log
        );
    });

    /**
     * Create a text file containing all node names
     */
    grunt.registerTask('print-nodes-names', 'Create a text file containing all node names.', function () {
        const nodes = grunt.config('nodes');
        let labels = '';
        for (const [key, value] of Object.entries(nodes.sections)) {
            if (value.nodes) {
                labels += grabNodeLabels(value);
            }
            if (value.sections) {
                for (const [subkey, subvalue] of Object.entries(value.sections)) {
                    labels += grabNodeLabels(subvalue);
                }
            }
        }
        // Write node labels to file
        grunt.file.write(
            grunt.config('paths.tmp') + grunt.config('files.debugNodes'),
            labels
        );
    });

    /**
     * Create tables for Sphinx
     */
    grunt.registerTask('create-sphinx-tables', 'Create tables and links for Sphinx and Markdown', function () {
        writeTables(false);
    });


    /**
     * Create tables for Markdown
     */
    grunt.registerTask('create-markdown-tables', 'Create tables for Markdown', function () {
        writeTables(true);
    });

    /**
     * Grab node labels from data object
     *
     * @returns string
     */
    function grabNodeLabels(nodes) {
        let labels = [];
        for (const nodeKey of Object.keys(nodes.nodes)) {
            let label = upperCamelCase(nodeKey);
            if (nodes.nodes[nodeKey]['label']) {
                label = nodes.nodes[nodeKey]['label'];
            }
            labels.push(nodeKey + '\t' + label);
        }
        return labels.join('\n') + '\n';
    }

    /**
     * Create tables for Sphinx and Markdown
     */
    function writeTables(markdown = false) {
        const indexFile = grunt.config('paths.source') + 'index.' + (markdown ? 'md' : 'rst');
        const fileContent = grunt.file.read(indexFile, { encoding: 'utf8' });
        const lines = fileContent.split('\n');
        const regexTable = '^\\\[table:([^\\\]]*)\\\]';
        const nodes = grunt.config('nodes');

        let tables = {};
        let links = '';
        let data = {};

        for (const [key, value] of Object.entries(nodes.sections)) {
            if (value.nodes) {
                data = getConfig(markdown, key, null, value);
                tables[key] = getTable(data);
                links += getLinks(data);
            }
            if (value.sections) {
                for (const [subkey, subvalue] of Object.entries(value.sections)) {
                    data = getConfig(markdown, key, subkey, subvalue);
                    tables[key + '/' + subkey] = getTable(data);
                    links += getLinks(data);
                }
            }
        }
        // Replace table markers in template
        let content = '';
        for (const line of lines) {
            const tableMarker = line.match(regexTable);
            if (tableMarker && tables[tableMarker[1]]) {
                content += tables[tableMarker[1]] + '\n';
            } else {
                content += line + '\n';
            }
        }
        // Replace date
        content = content.replace(/\|today\|/i, getDate());
        // Replace version
        content = content.replace(/\|version\|/i, grunt.config('pkg.version'));
        // Append links (if requested)
        content += links;
        // Write content to index file
        grunt.file.write(
            grunt.config('paths.target') + 'index.' + (markdown ? 'md' : 'rst'),
            content
        );
    };

    /**
     * Get configuration data
     *
     * @returns Object
     */
    function getConfig(markdown, section, subsection, nodes) {
        if (markdown) {
            return {
                fileExt: '.md',
                title: nodes.title,
                description: nodes.description,
                headers: nodes.versions,
                columnHeaders: nodes.columnHeaders,
                nodes: nodes.nodes,
                nodeKeys: Object.keys(nodes.nodes),
                labels: {
                    no: '◌',
                    yes: '◉'
                },
                separators: {
                    row: '-',
                    header: '='
                },
                markdown: markdown,
                linked: false, // false|'inline'|'append'
                pad: false,
                collapseDuplicateColumns: true,
                sectionKey: section + (subsection ? '/' + subsection : ''),
                section: section,
                subsection: subsection
            };
        } else {
            return {
                fileExt: '.rst',
                title: nodes.title,
                description: nodes.description,
                headers: nodes.versions,
                columnHeaders: nodes.columnHeaders,
                nodes: nodes.nodes,
                nodeKeys: Object.keys(nodes.nodes),
                labels: {
                    no: '\\-',
                    yes: 'Yes'
                },
                separators: {
                    row: '-',
                    header: '='
                },
                markdown: markdown,
                linked: 'append', // false|'inline'|'append'
                pad: true,
                collapseDuplicateColumns: false,
                sectionKey: section + (subsection ? '/' + subsection : ''),
                section: section,
                subsection: subsection
            };
        }
    }

    /**
     * Create links from nodes
     *
     * @returns string
     */
    function getLinks(data) {
        let links = '';
        if (data.linked && data.linked != 'inline') {
            for (const [nodeKey, nodeData] of Object.entries(data.nodes)) {
                for (const [version, node] of Object.entries(nodeData['versions'])) {
                    if (!node.doNotLink) {
                        const url = getUrl(data.section, data.subsection, nodeKey, version, node.url);
                        if (url) {
                            if (data.markdown) {
                                links += '\n  [' + nodeKey + '-' + version + ']: ' + url;
                            } else {
                                links += '\n.. _' + nodeKey + '-' + version + ': ' + url;
                            }
                        }
                    }
                }
            }
            let sectionKey = [];
            if (data.section) {
                sectionKey.push(data.section);
            }
            if (data.subsection) {
                sectionKey.push(data.subsection);
            }
            let comment = '';
            if (!data.markdown && links.length > 0) {
                comment = '\n..\n   _Section: ' + sectionKey.join('/') + '\n';
            } else {
            }
            return comment + links + '\n';
        } else {
            return '';
        }

    }

    /**
     * Get URL
     *
     * @returns string|null
     */
    function getUrl(section, subsection, nodeKey, version, url) {
        const language = grunt.config('language');
        const baseurl = grunt.config('baseurl');
        let urlSegment = '';
        if (subsection && parseFloat(version) > 3.4) {
            urlSegment = section + '/' + subsection + '/' + nodeKey + '.html';
        } else {
            urlSegment = section + '/' + nodeKey + '.html';
        }
        // Override with custom url
        if (url) {
            urlSegment = url;
        }
        if (urlSegment !== '') {
            return sprintf(baseurl, language, version) + urlSegment
        }
        return null;
    }

    /**
     * Get table content
     *
     * @returns string
     */
    function getTable(data) {
        // Create columns from JSON
        data = getColumns(data);
        // Remove duplicate columns
        data = collapseDuplicateColumns(data);
        // Create rows from columns
        data = getRows(data);
        // Insert row separators
        data = insertSeparatorRows(data);
        // Return final table data as string
        return joinRows(data);
    }

    /**
     * Transform data into columns
     *
     * @returns Object
     */
    function getColumns(data) {
        let cellWidths = [];
        cellWidths[0] = 0;

        let columns = [];

        columns[0] = [];
        cellWidths[0] = 0;

        // Create column header
        columns[0].push('');
        for (const nodeKey of data.nodeKeys) {
            let label = upperCamelCase(nodeKey);
            if (data.nodes[nodeKey]['label']) {
                label = data.nodes[nodeKey]['label'];
            }
            columns[0].push(label);
            if (label.length > cellWidths[0]) {
                cellWidths[0] = label.length;
            }
        }

        // Create columns from JSON
        data.headers.forEach(function (versionKey, index) {
            let column = [];
            let status = '';

            const versions = grunt.config('versions');
            let header = versions[versionKey].label;
            if (data.columnHeaders && data.columnHeaders[index]) {
                header = data.columnHeaders[index];
            }
            column.push(header);
            cellWidths[index + 1] = header.length;

            for (const nodeKey of data.nodeKeys) {
                let label = data.labels.no;
                let tableCell = '';
                const nodeData = data.nodes[nodeKey]['versions'][versionKey];
                if (nodeData) {
                    label = data.labels.yes;
                    if (nodeData.label) {
                        label = nodeData.label;
                    }
                    if (data.linked && !nodeData.doNotLink) {
                        const url = getUrl(data.sectionKey, nodeKey, versionKey, nodeData.url)
                        if (url) {
                            if (data.markdown) {
                                if (data.linked === 'inline') {
                                    tableCell = '[' + label + '](' + url + ')';
                                } else {
                                    tableCell = '[' + label + '][' + nodeKey + '-' + versionKey + ']';
                                }
                            } else {
                                if (data.linked === 'inline') {
                                    tableCell = '`' + label + ' <' + url + '_>`__';
                                } else {
                                    tableCell = '`' + label + ' <' + nodeKey + '-' + versionKey + '_>`_';
                                }
                            }
                        } else {
                            tableCell = label
                        }
                    } else {
                        tableCell = label;
                    }
                    if (nodeData.text) {
                        tableCell += ' ' + nodeData.text
                    }
                    status += '1';
                } else {
                    tableCell = label;
                    status += '0';
                }
                if (tableCell.length > cellWidths[index + 1]) {
                    cellWidths[index + 1] = tableCell.length;
                }
                column.push(tableCell);
            }
            columns[index + 1] = column;
        });
        data.columns = columns;
        data.cellWidths = cellWidths;

        return data;
    }

    /**
     * Remove duplicate columns and join column headers
     *
     * @returns Object
     */
    function collapseDuplicateColumns(data) {
        if (data.collapseDuplicateColumns) {
            let newColumns = [];
            let columns = data.columns.slice();
            columns = columns.reverse();
            let header = 0;
            let columnCount = 0;
            columns.forEach(function (column, columnIndex) {
                let currentColumn = column.slice();
                let previousColumn = columns[columnIndex + 1] ? columns[columnIndex + 1].slice() ?? [] : [];
                let currentHeader = currentColumn.shift();
                let previousHeader = previousColumn.shift();

                currentColumn = currentColumn.join();
                previousColumn = previousColumn.join();

                if (currentHeader) {
                    if (currentColumn !== previousColumn) {
                        if (parseFloat(currentHeader) != parseFloat(header)) {
                            if (columnCount) {
                                column[0] = currentHeader + ' - ' + header;
                            } else {
                                column[0] = currentHeader + '+';
                            }
                        }
                        header = previousHeader;
                        newColumns.push(column);
                        columnCount++;
                    } else {
                        if (!header) {
                            header = parseFloat(0);
                        }
                        if (columnIndex == 0) {
                            header = currentHeader;
                        }
                        else if (parseFloat(currentHeader) > parseFloat(header)) {
                            header = previousHeader;
                        }
                    }
                } else {
                    newColumns.push(column);
                }
            });
            data.columns = newColumns.reverse();
        }
        return data;

    }

    /**
     * Transform data into rows
     *
     * @returns Object
     */
    function getRows(data) {
        let rows = [];

        // Create rows from columns
        data.columns.forEach(function (column, columnIndex) {
            let cellWidth = data.cellWidths[columnIndex] + 2;

            for (let rowIndex = 0; rowIndex < column.length; rowIndex++) {
                // Add row content
                if (!rows[rowIndex]) {
                    rows[rowIndex] = [];
                };
                let cellData = ' ' + data.columns[columnIndex][rowIndex] + ' ';
                if (data.pad || !data.markdown) {
                    cellData = cellData.padEnd(cellWidth, ' ');
                }
                rows[rowIndex].push(cellData);
            }
        });

        data.rows = rows;
        return data;
    }

    /**
     * Insert row separators for RST
     *
     * @returns Object
     */
    function insertSeparatorRows(data) {
        let separatorRow = [];
        let separatorHeader = [];
        if (data.markdown) {
            data.columns.forEach(function (column, columnIndex) {
                const cellWidth = data.cellWidths[columnIndex];
                let value = '';
                if (data.pad) {
                    value = data.separators.row.padEnd(cellWidth + 2, data.separators.row);
                } else {
                    value = ':---:';
                    if (columnIndex == 0) {
                        value = ':---';
                    }
                }
                separatorRow.push(value);
            });
            data.rows.splice(1, 0, separatorRow);
        } else {
            data.columns.forEach(function (column, columnIndex) {
                const cellWidth = data.cellWidths[columnIndex];
                valueRow = data.separators.row.padEnd(cellWidth + 2, data.separators.row);
                valueHeader = data.separators.header.padEnd(cellWidth + 2, data.separators.header);
                separatorRow.push(valueRow);
                separatorHeader.push(valueHeader);
            });
            const total = data.rows.length * 2;
            for (let rowIndex = 0; rowIndex < total; rowIndex++) {
                if (rowIndex % 2) {
                    if (rowIndex == 1) {
                        data.rows.splice(rowIndex, 0, separatorHeader);
                    } else {
                        data.rows.splice(rowIndex, 0, separatorRow);
                    }
                }
            };
            data.rows.splice(0, 0, separatorRow);
        }
        return data;
    }

    /**
     * Join the rows and return table content
     *
     * @returns string
     */
    function joinRows(data) {
        let content = '';
        data.rows.forEach(function (row, index) {
            const alternating = index % 2;
            let joinString = '+';
            if (alternating || data.markdown) {
                joinString = '|';
            }
            content += joinString + row.join(joinString) + joinString + '\n';
        });
        return content;
    }

    /**
     * Get the current date as formatted string
     *
     * @returns string
     */
    function getDate() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const d = new Date();
        return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    }

    /**
     * Check if the machine runs on Windows.
     *
     * @returns boolean
     */
    function isWindows() {
        const exec = require('child_process').execSync;
        if (exec('echo %SYSTEMROOT%') === '%SYSTEMROOT%') {
            return false;
        }
        return true;
    }

    /**
     * Convert string value to UpperCamelCase
     *
     * @returns string
     */
    function upperCamelCase(value) {
        value = value.replace(/_/g, ' ');
        value = value.replace(/\w+/g, function (w) {
            // CamelCase all
            w = w[0].toUpperCase() + w.slice(1).toLowerCase();
            w = w
                .split(' ')
                // uppercase specific words
                .map(s => s.match(/\b(Rgb|Xyz|Id|3d|Csv|Ply|Obj|Stl|Vdb|Uv)\b/) && s.trim().toUpperCase() || s)
                // lowercase specific words
                .map(s => s.match(/\b(On|Of|In|By|To|Is|At)\b/) && s.trim().toLowerCase() || s);
            return w;
        });
        // Uppercase first char and return
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    grunt.registerTask('default', ['create-sphinx-tables', 'check-links-in-rst']);

    grunt.registerTask('create-sphinx', ['create-sphinx-tables']);
    grunt.registerTask('create-markdown', ['create-markdown-tables']);
    grunt.registerTask('check-links', ['check-links-in-rst']);
    grunt.registerTask('debug-nodes', ['print-nodes-names']);
};
