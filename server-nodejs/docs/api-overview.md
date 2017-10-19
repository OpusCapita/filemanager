# Files

REST

| Method              | REST   | URL               | Request                                    | Response                                   |
|---------------------+--------+-------------------+--------------------------------------------+--------------------------------------------|
| Get client config   | GET    | api/client-config | -                                          | :client-config-resource                    |
| Get file/dir stats  | GET    | api/files/:id     | { ?childrenQuery, ?stats }                 | { stats: :file-stats-resource, ?children } |
| Create new file/dir | POST   | api/files         | { parentId, isDir, title, contentForFile } | :file-stats-resource                       |
| Delete file/dir     | DELETE | api/files/:id     | -                                          | -                                          |

TBD ids for files.

REST with ids in base64

| Method                  | REST   | URL                    | Request                             | Response                              |
|-------------------------+--------+------------------------+-------------------------------------+---------------------------------------|
| Get client config       | GET    | api/client-config      | -                                   | :client-config-resource               |
| Get dir children list   | GET    | api/files/:id/children | :childrenQuery                      | { items: [... :file-stats-resource] } |
| Get file/dir stats      | GET    | api/files/:id/stats    | -                                   | :file-stats-resource                  |
| Get file/compressed dir | GET    | api/files/:id/download | -                                   | :binary-data                          |
| Create new file/dir     | POST   | api/files/:id          | { isDirectory, title, fileContent } | :file-stats-resource                  |
| Delete file/dir         | DELETE | api/files/:id          | -                                   | -                                     |

RPC (all POST requests)

| Method                | URL               | Request                                    | Response                              |
|-----------------------+-------------------+--------------------------------------------+---------------------------------------|
| Get client config     | api/client-config | -                                          | :client-config-resource               |
| Get dir children list | api/children      | { id, childrenQuery }                      | { items: [... :file-stats-resource] } |
| Get file/dir stats    | api/stats         | { id }                                     | :file-stats-resource                  |
| Create new file/dir   | api/create        | { parentId, isDir, title, contentForFile } | :file-stats-resource                  |
| Delete file/dir       | api/delete        | { id }                                     | -                                     |

## Get file stats

### Request

* URL: `api/files/id`
* Method: GET

{
   ?childrenQuery: {
     maxResults: <number>, // TODO in v2
     orderDirection: <string>, // ASC/DESC
     orderBy: <string>, // one of 'createdDate', 'folder', 'modifiedDate', 'quotaBytesUsed', 'title'.
     pageToken: <string>, // TODO in v2
     searchQuery: <string>, // search TODO in v2
     searchResursively: <bool> // TODO in v2
  }
}

### Response

#### File stats resouce

```
id: <string>,
title: <string>,
isDirectory: <bool>, // TBD type
createDate: <string>,
modifyDate: <string>,
size: <string>,
md5Checksum: <string>, // TODO in v2,
downloadUrl: <string>,
?children: [
  <file stats resource>       
]
```

## Create new file or directory

* URL: `api/files`
* Method: POST

### Request

```
{
  parentId: <string> // TBD - in URL or request body
  isDirectory: <bool>
  title: <string>
  content: <bytes> // Not for directory
}
```

### Response

```
{
  <file stats resource>
}
```

## Delete file or directory

* URL: `api/files/id`
* Method: DELETE

### Response

If successful, this method returns an empty response body.

# Children

## Get clildren list

* URL: `api/children/id`
* Method: GET

### Request

```
{
  maxResults: <number>, // TODO in v2
  orderDirection: <string>, // ASC/DESC
  orderBy: <string>, // one of 'createdDate', 'folder', 'modifiedDate', 'quotaBytesUsed', 'title'.
  pageToken: <string>, // TODO in v2
  searchQuery: <string>, // search TODO in v2
  searchResursively: <bool> // TODO in v2
}
```

### Response

```
{
  items: [
    <file stats resource> // TBD
  ],
  nextPageToken // TODO in v2
}
```

# Client config

## Get client config

* URL: `api/client-config`
* METHOD: GET

```
  "layout": {
    "readOnly": false,
  },
  "fileIcons": {
    "wordDocument": {
      "pattern": ["\\.(doc|docx)", "i"],
      "uri": "/img/file-icons/word-file.svg"
    },
    "excelDocument": {
      "pattern": ["\\.(xls|xlsx)", "i"],
      "uri": "/img/file-icons/excel-file.svg"
    },
    "pdfDocument": {
      "pattern": ["\\.(pdf)", "i"],
      "uri": "/img/file-icons/pdf-file.svg"
    },
    "textDocument": {
      "pattern": ["\\.(txt)", "i"],
      "uri": "/img/file-icons/text-file.svg"
    },
    "jsCode": {
      "pattern": ["\\.(js|jsx|mjs)", "i"],
      "uri": "/img/file-icons/js-file.svg"
    },
    "gspCode": {
      "pattern": ["\\.(gsp)", "i"],
      "uri": "/img/file-icons/gsp-file.svg"
    },
    "sound": {
      "pattern": ["\\.(wav|wma|mp3|ogg|flac|aiff)", "i"],
      "uri": "/img/file-icons/sound-file.svg"
    },
    "video": {
      "pattern": ["\\.(webm|mkv|flv|vob|avi|wmv|mpg|mpeg|mpv|m4v)", "i"],
      "uri": "/img/file-icons/video-file.svg"
    },
    "compressed": {
      "pattern": ["\\.(gz|tar|rar|g?zip)$", "i"],
      "uri": "/img/file-icons/compressed.svg"
    },
    "directory": {
      "uri": "/img/file-icons/directory.svg"
    },
    "unknown": {
      "pattern": ["\\.*", "i"],
      "uri": "/img/file-icons/unknown-file.svg"
    }
  }
```
