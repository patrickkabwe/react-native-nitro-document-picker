
export type NitroDocumentType = 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'txt' | 'csv' | 'image' | 'video' | 'audio'

export type NitroDocumentPickerOptions = {
    /**
     * The type of documents to pick.
     */
    types: NitroDocumentType[]
    /**
     * Whether to allow multiple documents to be picked.
     * @default false
     */
    multiple?: boolean
    /**
     * The maximum file size in bytes.
     * @default 50 * 1024 * 1024 (50MB)
     */
    maxFileSize?: number
    /**
     * Local only mode.
     * @platform android
     * @default false
     */
    localOnly?: boolean
}

export type NitroDocumentPickerResult = {
    /**
     * The URI of the document.
     */
    uri: string
    /**
     * The name of the document.
     * @example 'document.pdf'
     */
    name: string
    /**
     * The mime type of the document.
     * @example 'application/pdf'
     */
    mimeType: string
    /**
     * The size of the document in bytes.
     * @example 1000000
     */
    size: number
}