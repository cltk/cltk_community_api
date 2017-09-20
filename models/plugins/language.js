import languages from 'languages';

export default function languagePlugin(schema, options) {

	let defaultValue = process.env.DEFAULT_LANGUAGE;
	if (options && typeof options.defaultValue === 'string') defaultValue = options.defaultValue;

	schema.add({
		language: {
			type: String,
			default: defaultValue,
			enum: languages.getAllLanguageCode(),
		}
	});

	if (options && options.index) {
		schema.path('language').index(options.index);
	}
}
