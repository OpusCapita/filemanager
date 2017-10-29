# Summary

| Method                                                      | REST   | URL                    | Request                             | Response                              |
|-------------------------------------------------------------|--------|------------------------|-------------------------------------|---------------------------------------|
| [Create new file/dir](#create-new-file-or-directory)        | POST   | api/files              | {<br />&nbsp;&nbsp;parentId,<br />&nbsp;&nbsp;type,<br />&nbsp;&nbsp;?title,<br />&nbsp;&nbsp;?files<br />} | :file-stats-resource                  |
| [Get dir stats](#get-file-or-directory-statistics) for root | GET    | api/files              | -                                   | :file-stats-resource                  |
| [Get file/dir stats](#get-file-or-directory-statistics)     | GET    | api/files/:id          | -                                   | :file-stats-resource                  |
| [Delete file/dir](#delete-file-or-directory)                | DELETE | api/files/:id          | -                                   | -                                     |
| [Get dir children list](#get-directory-children-list)       | GET    | api/files/:id/children | {<br />&nbsp;&nbsp;orderBy,<br />&nbsp;&nbsp;orderDirection,<br />&nbsp;&nbsp;maxResults,<br />&nbsp;&nbsp;pageToken,<br />&nbsp;&nbsp;searchQuery,<br />&nbsp;&nbsp;searchRecursively<br />}    | {<br />&nbsp;&nbsp;items: [... :file-stats-resource],<br />&nbsp;&nbsp;nextPageToken<br />} |
| Copy file/dir to destination                                | POST   | api/files/:id/copy/    | {<br />&nbsp;&nbsp;destination: :id<br />}                |                                       |
| Move file/dir to destination                                | POST   | api/files/:id/move/    | {<br />&nbsp;&nbsp;destination: :id<br />}                |                                       |
| Get file(s)/compressed dir                                  | GET    | api/download           | [... :id]                           | :binary-data                          |
| [Get client config](#get-client-configuration)              | GET    | api/client-config      | -                                   | :client-config-resource               |

NOTE: file/dir ID is its path+name in base64.  There is no trailing slash for dirs. Path starts with slash and relative to a user root dir.

# Files

## File stats resource

```javascript
{
  id: <string>,
  title: <string>,
  type: <string>, // "dir" or "file"
  createDate: <string>,
  modifyDate: <string>,
  ?size: <string>, // for files only
  ?parentId: <string>, // for non-root only
  md5Checksum: <string>, // TODO in v2
  downloadUrl: <string>,
  capabilities: {
    canListChildren: <boolean>,
    canAddChildren: <boolean>,
    canRemoveChildren: <boolean>,
    canDelete: <boolean>,
    canDownload: <boolean>
  }
}
```

## Create new file or directory

* URL: `api/files`
* Method: POST
* Content-Type: multipart/form-data

### Request

FormData instance with the following field name/value pairs.

| Field Name | Field Value  | Comments               |
|------------|--------------|------------------------|
|  parentId  | \<string\>   |                        |
|  type      | \<string\>   |                        |
| ?title     | \<string\>   | for type==='dir' only  |
| ?files     | \<FileList\> | for type==='file' only |

### Response

```javascript
<file stats resource>
```

A 204 status is returned if a dir with parentId does not exist.

## Delete file or directory

* URL: `api/files/id`
* Method: DELETE

### Request

None.

### Response

If successful, this method returns an empty response body.

## Get directory children list

* URL: `api/files/:id/children`
* Method: GET

### Request

```javascript
{
  orderBy: <string>, // one of 'createdDate', 'folder', 'modifiedDate', 'quotaBytesUsed', 'title'.
  orderDirection: <string>, // ASC/DESC
  maxResults: <number>, // TODO in v2
  pageToken: <string>, // TODO in v2
  searchQuery: <string>, // TODO in v2
  searchRecursively: <bool> // TODO in v2
}
```

### Response

```javascript
{
  items: [<file stats resource>, ...],
  nextPageToken // TODO in v2
}
```

## Get file or directory statistics

* URL: `api/files/:id/stats`
* Method: GET

### Request

None.

### Response

```
<file stats resource>
```

# Client config

## Client config resource

```javascript
{
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
}
```

## Get client configuration

* URL: `api/client-config`
* METHOD: GET

### Request

None.

### Response

```javascript
<client config resource>
```
