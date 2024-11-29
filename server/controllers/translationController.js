const supabase = require("../supabase");

exports.getPackages = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("translation_packages")
      .select("package_name");

    if (error) throw error;

    res.json(data.map((pkg) => pkg.package_name));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPackageTranslations = async (req, res) => {
  const { package } = req.params;

  try {
    const { data, error } = await supabase
      .from("translations")
      .select("language, key, text")
      .eq("package_name", package);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLanguageTranslations = async (req, res) => {
  const { package, language } = req.params;

  try {
    const { data, error } = await supabase
      .from("translations")
      .select("key, text")
      .eq("package_name", package)
      .eq("language", language);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addOrUpdateTranslations = async (req, res) => {
  const { package } = req.params;
  const { language, translations } = req.body;

  try {
    // Upsert the package
    const { error: packageError } = await supabase
      .from("translation_packages")
      .upsert({ package_name: package });

    if (packageError) throw packageError;

    // Delete existing translations for the package and language
    await supabase
      .from("translations")
      .delete()
      .eq("package_name", package)
      .eq("language", language);

    // Insert new translations
    const newTranslations = translations.map((t) => ({
      package_name: package,
      language,
      key: t.key,
      text: t.text,
    }));

    const { error: insertError } = await supabase
      .from("translations")
      .insert(newTranslations);

    if (insertError) throw insertError;

    res.status(200).json({ message: "Translations updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
