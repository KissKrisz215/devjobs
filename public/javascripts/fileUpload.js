const { FilePond } = require("filepond");

FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
)


FilePond.parse(document.body);