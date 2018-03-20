# Summary

| Method                                                      | REST   | URL                    | Request                             | Response                              |
|-------------------------------------------------------------|--------|------------------------|-------------------------------------|---------------------------------------|
| [Create new file/dir](#create-new-file-or-directory)        | POST   | api/files              | {<br />&nbsp;&nbsp;parentId,<br />&nbsp;&nbsp;type,<br />&nbsp;&nbsp;?name,<br />&nbsp;&nbsp;?files<br />} | :file-stats-resource<br />or<br />[... :file-stats-resource]                  |
| [Get dir stats](#get-file-or-directory-statistics) for root | GET    | api/files              | -                                   | :file-stats-resource                  |
| [Get file/dir stats](#get-file-or-directory-statistics)     | GET    | api/files/:id          | -                                   | :file-stats-resource                  |
| [Delete file/dir](#delete-file-or-directory)                | DELETE | api/files/:id          | -                                   | -                                     |
| [Get dir children list](#get-directory-children-list)       | GET    | api/files/:id/children | orderBy=...<br />&orderDirection=...    | {<br />&nbsp;&nbsp;items: [... :file-stats-resource]<br />} |
| [Search for files/dirs](#search-for-filesdirs)              | GET    | api/files/:id/search | itemNameSubstring=...<br />&itemNameCaseSensitive=...<br />&itemType=...<br />&recursive=...    | {<br />&nbsp;&nbsp;items: [... :file-stats-resource],<br />&nbsp;&nbsp;nextPage<br />} |
| [Rename/copy/move](#rename-andor-copymove-filedir-to-destination) | PATCH   | api/files/:id    | {<br />&nbsp;&nbsp;?parents: [:id, ...],<br />&nbsp;&nbsp;?name<br />} |  :file-stats-resource |
| [Get file(s)/compressed dir](#get-filescompressed-dir) | GET    | api/download           | <span style="word-wrap: break-word; white-space: pre;">preview=...<br />&items=:id<br />&items=:id...</span>                          | :binary-data                          |

File/dir ID is its path+name in base64 ([base64url](https://www.npmjs.com/package/base64url)-variation).  There is no trailing slash for dirs. Path starts with slash and relative to a user root dir.

To prevent caching, [helmet.noCache()](https://helmetjs.github.io/docs/nocache/) is used to add the following HTTP headers to all responses:

* Surrogate-Control: no-store
* Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate
* Pragma: no-cache
* Expires: 0

# API

## File stats resource

### Standard resource structure

```javascript
{
  id: <string>,
  name: <string>,
  type: <string>, // "dir" or "file"
  createdTime: <string>,
  modifiedTime: <string>,
  ?size: <string>, // for files only
  ?parentId: <string>, // for non-root only
  md5Checksum: <string>, // TODO in v2
  capabilities: {
    canListChildren: <boolean>,
    canAddChildren: <boolean>,
    canRemoveChildren: <boolean>,
    canDelete: <boolean>,
    canRename: <boolean>,
    canCopy: <boolean>,
    canEdit: <boolean>,
    canDownload: <boolean>
  }
}
```

### Optional custom properties

```javascript
{
  ancestors: [<file stats resource>, ...] // list of ancestors starting with user root dir, empty for the root
}
```

## Create new file or directory

* URL: `api/files`
* Method: POST
* Content-Type: multipart/form-data

### Request Body

FormData instance with the following field name/value pairs.

| Field Name | Field Value  | Comments               |
|------------|--------------|------------------------|
|  parentId  | \<string\>   |                        |
|  type      | \<string\>   |                        |
| ?name      | \<string\>   | for type 'dir' only    |
| ?files     | \<FileList\> | for type 'file' only   |

### Response

For directory creation:

```javascript
<file stats resource>
```

For file(s) upload:

```javascript
[<file stats resource>, ...]
```

A 410 status is returned if a dir with parentId does not exist.

## Delete file or directory

* URL: `api/files/id`
* Method: DELETE

### Request Query Parameters

None.

### Response

If successful, this method returns an empty response body.

## Get directory children list

* URL: `api/files/:id/children`
* Method: GET

### Request Query Parameters

All query paramaters are optional

| Name           | Possible Values        | Default |
|----------------|------------------------|---------|
| orderBy        | name<br />modifiedTime | name    |
| orderDirection | ASC<br />DESC          | ASC     |

TODO in v2:

* maxResults: \<number\>

### Response

```javascript
{
  items: [<file stats resource>, ...]
}
```

## Search for files/dirs

* URL: `api/files/:id/search`
* Method: GET

### Request Query Parameters

All query paramaters are optional

| Name                     | Possible Values | Default           |
|--------------------------|-----------------|-------------------|
| itemNameSubstring        | any string      | -                 |
| itemNameCaseSensitive    | true<br />false | false             |
| itemType                 | file<br />dir   | both file and dir |
| recursive                | true<br />false | true              |

TODO in v2:

* maxResults: \<number\>

### Response

```javascript
{
  items: [<file stats resource>, ...],
  ?nextPage: <string, url path part, i.e. everything after host/port, starting with slash>
}
```

## Get file or directory statistics

* URL: `api/files/:id`
* Method: GET

### Request Query Parameters

None.

### Response

```
<file stats resource>
```

## Get file(s)/compressed dir

* URL: `api/download`
* Method: GET

### Request Query Parameters

| Name           | Value         | Default | Comments                                                    |
|----------------|---------------|---------|-------------------------------------------------------------|
| preview        | true or false | false   | Applicable only when single **items** parameter is file ID  |
| items          | dir/file id   | -       | Both folder and file IDs are allowed as **items**           |
| items          | dir/file id   | -       | When multiple **items**, all _must_ be from the same folder |
| ...            | ...           | ...     |                                                             |

### Response

For single file download:

* Content-Type: \<appropriate mime type\>
* Content-Disposition: attachment; filename="\<string\>"

For single file preview:

* Content-Type: \<appropriate mime type\>

For a dir or multiple dirs/files download:

* Content-Type: application/zip
* Content-Disposition: attachment; filename="\<string\>"

Binary data.

## Rename and/or copy/move file/dir to destination

* URL: `api/files/:id`
* Method: PATCH

### Request Body

```javascript
{
  ?parents: [<string>, ...],
  ?name: <string>
}
```

When moving a file/dir, **parents** array has destination parent ID only.  **name**, if specified, gives a new name in destination.

When copying a file/dir, **parents** array has both current parent ID and destination parent ID (order is irrelevant).  **name**, if specified, gives a new name in destination.  When copying inside parent dir, **parents** array may have either one parent ID or parent ID repeated twice.

When renaming a file/dir, **parents** parameter is not set or empty array.

If target exists, the file/dir is copied/moved with suffix ` (<number>)`, where number is tried with 1, 2, etc. untill first free name is found.

### Response

```
<file stats resource>
```

# Error

In case of an error, HTTP response is sent with error status code and empty body.  Available HTTP error status codes:

* 400
* 403
* 410
* 500
