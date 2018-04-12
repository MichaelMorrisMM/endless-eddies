import javax.json.*;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

public class ConfigSettings {
    private static final String TYPE_FLAG = "flag";
    private static final String GROUP_USERS = "users";
    private static final String NODE_SETTINGS = "settings";
    private static final String SETTING_ALLOW_GUEST_MODE = "allow_guest_mode";
    private static final String SETTING_ALLOW_GOOGLE_AUTH = "allow_google_auth";
    private static final String SETTING_ALLOW_GITHUB_AUTH = "allow_github_auth";

    private Map<String, Setting> settings;

    ConfigSettings() {
        settings = new HashMap<>();
        settings.put(SETTING_ALLOW_GUEST_MODE, new Setting(SETTING_ALLOW_GUEST_MODE, JsonValue.FALSE, GROUP_USERS, TYPE_FLAG));
        settings.put(SETTING_ALLOW_GOOGLE_AUTH, new Setting(SETTING_ALLOW_GOOGLE_AUTH, JsonValue.FALSE, GROUP_USERS, TYPE_FLAG));
        settings.put(SETTING_ALLOW_GITHUB_AUTH, new Setting(SETTING_ALLOW_GITHUB_AUTH, JsonValue.FALSE, GROUP_USERS, TYPE_FLAG));
    }

    ConfigSettings(File configFile) throws FileNotFoundException {
        this();
        try (JsonReader reader = Json.createReader(new FileReader(configFile))) {
            this.updateWithConfig(reader.readObject());
        }
    }

    public void updateWithConfig(JsonObject config) {
        JsonArray settingsArray = config.getJsonArray(NODE_SETTINGS);
        if (settingsArray != null) {
            for (JsonObject obj : settingsArray.getValuesAs(JsonObject.class)) {
                Setting setting = this.settings.get(obj.getString(Setting.NAME));
                if (setting != null) {
                    setting.updateWith(obj);
                }
            }
        }
    }

    public JsonObject getConfig() {
        return Json.createObjectBuilder()
            .add(NODE_SETTINGS, this.getSettings())
            .build();
    }

    private JsonArray getSettings() {
        JsonArrayBuilder builder = Json.createArrayBuilder();
        for (Entry<String, Setting> e : this.settings.entrySet()) {
            builder = builder.add(e.getValue().toJsonObject());
        }
        return builder.build();
    }

    public void revertToDefaults() {
        for (Setting setting : this.settings.values()) {
            setting.value = setting.defaultValue;
        }
    }

    private class Setting {
        static final String NAME = "name";
        static final String VALUE = "value";
        static final String GROUP = "group";
        static final String TYPE = "type";

        final String name;
        JsonValue value;
        final JsonValue defaultValue;
        final String type;
        final String group;

        Setting(String n, JsonValue v, String g, String t) {
            this.name = n;
            this.value = v;
            this.defaultValue = v;
            this.group = g;
            this.type = t;
        }

        JsonObject toJsonObject() {
            return Json.createObjectBuilder()
                .add(NAME, this.name)
                .add(VALUE, this.value)
                .add(GROUP, this.group)
                .add(TYPE, this.type)
                .build();
        }

        void updateWith(JsonObject updateObject) {
            JsonValue newValue = updateObject.get(VALUE);
            if (newValue != null) {
                this.value = newValue;
            }
        }
    }
}
