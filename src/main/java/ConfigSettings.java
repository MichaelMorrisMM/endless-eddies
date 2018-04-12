import javax.json.*;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

public class ConfigSettings {
    private static final String TYPE_FLAG = "flag";
    private static final String TYPE_STRING = "string";
    private static final String TYPE_INTEGER = "integer";
    private static final String TYPE_FLOAT = "float";
    private static final String GROUP_USERS = "users";
    private static final String NODE_SETTINGS = "settings";
    private static final String NODE_PARAMETERS = "parameters";
    private static final String SETTING_ALLOW_GUEST_MODE = "allow_guest_mode";
    private static final String SETTING_ALLOW_GOOGLE_AUTH = "allow_google_auth";
    private static final String SETTING_ALLOW_GITHUB_AUTH = "allow_github_auth";

    private Map<String, Setting> settings;
    private Map<String, Parameter> parameters;
    private Set<String> typeSet;

    ConfigSettings() {
        this.typeSet = new HashSet<>();
        this.typeSet.add(TYPE_FLAG);
        this.typeSet.add(TYPE_STRING);
        this.typeSet.add(TYPE_INTEGER);
        this.typeSet.add(TYPE_FLOAT);

        settings = new HashMap<>();
        settings.put(SETTING_ALLOW_GUEST_MODE, new Setting(SETTING_ALLOW_GUEST_MODE, JsonValue.FALSE, GROUP_USERS, TYPE_FLAG));
        settings.put(SETTING_ALLOW_GOOGLE_AUTH, new Setting(SETTING_ALLOW_GOOGLE_AUTH, JsonValue.FALSE, GROUP_USERS, TYPE_FLAG));
        settings.put(SETTING_ALLOW_GITHUB_AUTH, new Setting(SETTING_ALLOW_GITHUB_AUTH, JsonValue.FALSE, GROUP_USERS, TYPE_FLAG));

        parameters = new HashMap<>();
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

        JsonArray parametersArray = config.getJsonArray(NODE_PARAMETERS);
        if (parametersArray != null) {
            this.parameters.clear();
            for (JsonObject obj : parametersArray.getValuesAs(JsonObject.class)) {
                if (this.isValidParameter(obj)) {
                    Parameter param = new Parameter(obj);
                    this.parameters.put(param.name, param);
                }
            }
        }
    }

    public JsonObject getConfig() {
        return Json.createObjectBuilder()
            .add(NODE_SETTINGS, this.getSettings())
            .add(NODE_PARAMETERS, this.getParameters())
            .build();
    }

    private JsonArray getSettings() {
        JsonArrayBuilder builder = Json.createArrayBuilder();
        for (Entry<String, Setting> e : this.settings.entrySet()) {
            builder = builder.add(e.getValue().toJsonObject());
        }
        return builder.build();
    }

    private JsonArray getParameters() {
        JsonArrayBuilder builder = Json.createArrayBuilder();
        for (Entry<String, Parameter> e : this.parameters.entrySet()) {
            builder = builder.add(e.getValue().toJsonObject());
        }
        return builder.build();
    }

    public void revertToDefaults() {
        for (Setting setting : this.settings.values()) {
            setting.value = setting.defaultValue;
        }
    }

    private boolean isValidParameter(JsonObject obj) {
        String name = obj.getString(Parameter.NAME);
        JsonValue defaultValue = obj.get(Parameter.DEFAULT_VALUE);
        String type = obj.getString(Parameter.TYPE);

        return name != null && !name.equals("") && defaultValue != null
            && type != null && this.typeSet.contains(type);
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

    private class Parameter {
        static final String NAME = "name";
        static final String DEFAULT_VALUE = "defaultValue";
        static final String TYPE = "type";

        final String name;
        final JsonValue defaultValue;
        final String type;

        Parameter(String n, JsonValue defVal, String t) {
            this.name = n;
            this.defaultValue = defVal;
            this.type = t;
        }

        Parameter(JsonObject obj) {
            this(obj.getString(NAME), obj.get(DEFAULT_VALUE), obj.getString(TYPE));
        }

        JsonObject toJsonObject() {
            return Json.createObjectBuilder()
                .add(NAME, this.name)
                .add(DEFAULT_VALUE, this.defaultValue)
                .add(TYPE, this.type)
                .build();
        }
    }
}
