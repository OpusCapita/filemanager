package com.opuscapita.filemanager.resource;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum Capabilities {

    ROOT_DIR(false, false, false, false, false, true, true, true),
    COMMON_DIR(true, true, true, false, false, true, true, true),
    COMMON_FILE(true, true, true, true, true, null, null, null);

    private final Boolean canDelete;
    private final Boolean canRename;
    private final Boolean canCopy;
    private final Boolean canEdit;
    private final Boolean canDownload;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private final Boolean canListChildren;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private final Boolean canAddChildren;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private final Boolean canRemoveChildren;
}
