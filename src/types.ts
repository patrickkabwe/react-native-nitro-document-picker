
export type NitroDocumentType =
    // All file types
    | 'all'
    // Existing document types
    | 'pdf'
    | 'docx'
    | 'xlsx'
    | 'pptx'
    | 'txt'
    | 'csv'
    // Rich Text/Markup
    | 'rtf'
    | 'html'
    | 'xml'
    | 'md'
    | 'markdown'
    // Archives
    | 'zip'
    // Code files
    | 'js'
    | 'javascript'
    | 'ts'
    | 'typescript'
    | 'json'
    | 'css'
    | 'py'
    | 'cpp'
    | 'c'
    | 'swift'
    | 'kt'
    | 'kotlin'
    // E-books
    | 'epub'
    // Fonts
    | 'ttf'
    | 'otf'
    // Databases
    | 'db'
    | 'sqlite'
    // Config files
    | 'yaml'
    | 'yml'
    // CAD/Design
    | 'svg'
    // Audio types
    | 'mp3'
    | 'wav'
    // Video types
    | 'mp4'
    | 'mov'
    | 'avi'
    | 'mkv'
    | 'webm'
    // Image types
    | 'jpg'
    | 'jpeg'
    | 'png'
    | 'gif'
    | 'webp'

export type NitroDocumentPickerOptions = {
    /**
     * The type of documents to pick.
     * Use 'all' to allow all file types.
     */
    types: NitroDocumentType[]
    /**
     * Whether to allow multiple documents to be picked.
     * @default false
     */
    multiple?: boolean
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