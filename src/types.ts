
export type NitroDocumentType = 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'txt' | 'csv'

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
}

export type NitroDocumentPickerResult = {
    path: string
    base64?: string
    name: string
}