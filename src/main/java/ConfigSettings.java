import javax.json.*;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

public class ConfigSettings {
    private static final String SETTING_ALLOW_GUEST_MODE = "allow_guest_mode";
    private static final String SETTING_ALLOW_GOOGLE_AUTH = "allow_google_auth";
    private static final String SETTING_ALLOW_GITHUB_AUTH = "allow_github_auth";

    private Map<String, Setting> settings;

    ConfigSettings() {
        settings = new HashMap<>();
        settings.put(SETTING_ALLOW_GUEST_MODE, new Setting(JsonValue.FALSE));
        settings.put(SETTING_ALLOW_GOOGLE_AUTH, new Setting(JsonValue.FALSE));
        settings.put(SETTING_ALLOW_GITHUB_AUTH, new Setting(JsonValue.FALSE));
    }

    ConfigSettings(File configFile) throws FileNotFoundException {
        this();
        try (JsonReader reader = Json.createReader(new FileReader(configFile))) {
            this.parseConfigFile(reader.readObject());
        }
    }

    private void parseConfigFile(JsonObject config) {
        for (Entry<String, JsonValue> e : config.entrySet()) {
            Setting setting = this.settings.get(e.getKey());
            if (setting != null) {
                setting.value = e.getValue();
            }
        }
    }

    public JsonObject getConfig() {
        JsonObjectBuilder builder = Json.createObjectBuilder();
        for (Entry<String, Setting> e : this.settings.entrySet()) {
            builder = builder.add(e.getKey(), e.getValue().value);
        }
        return builder.build();
    }

    public void revertToDefaults() {
        for (Setting setting : this.settings.values()) {
            setting.value = setting.defaultValue;
        }
    }

    private class Setting {
        JsonValue value;
        final JsonValue defaultValue;

        Setting(JsonValue v) {
            this.value = v;
            this.defaultValue = v;
        }
    }
}
