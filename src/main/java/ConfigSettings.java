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

    public static final String TYPE_FLAG = "flag";
    public static final String TYPE_STRING = "string";
    public static final String TYPE_INTEGER = "integer";
    public static final String TYPE_FLOAT = "float";
    private static Set<String> typeSet;
    static {
        typeSet = new HashSet<>(4);
        typeSet.add(TYPE_FLAG);
        typeSet.add(TYPE_STRING);
        typeSet.add(TYPE_INTEGER);
        typeSet.add(TYPE_FLOAT);
    }

    public static final String GROUP_USERS = "users";
    private static Set<String> groupSet;
    static {
        groupSet = new HashSet<>(1);
        groupSet.add(GROUP_USERS);
    }

    public static final String NODE_SETTINGS = "settings";
    public static final String NODE_PARAMETERS = "parameters";

    public static final String SETTING_ALLOW_GUEST_MODE = "allow_guest_mode";
    public static final String SETTING_ALLOW_GOOGLE_AUTH = "allow_google_auth";
    public static final String SETTING_ALLOW_GITHUB_AUTH = "allow_github_auth";

    private Map<String, Setting> settings;
    private Map<String, Parameter> parameters;

    public ConfigSettings() {
        settings = new HashMap<>();
        settings.put(SETTING_ALLOW_GUEST_MODE, new Setting(SETTING_ALLOW_GUEST_MODE, JsonValue.FALSE, GROUP_USERS, TYPE_FLAG));
        settings.put(SETTING_ALLOW_GOOGLE_AUTH, new Setting(SETTING_ALLOW_GOOGLE_AUTH, JsonValue.FALSE, GROUP_USERS, TYPE_FLAG));
        settings.put(SETTING_ALLOW_GITHUB_AUTH, new Setting(SETTING_ALLOW_GITHUB_AUTH, JsonValue.FALSE, GROUP_USERS, TYPE_FLAG));

        parameters = new HashMap<>();
    }

    public ConfigSettings(File configFile) throws FileNotFoundException {
        this();
        try (JsonReader reader = Json.createReader(new FileReader(configFile))) {
            this.updateWithConfig(reader.readObject());
        }
    }

    public void updateWithConfig(JsonObject config) {
        JsonArray settingsArray = config.getJsonArray(NODE_SETTINGS);
        if (settingsArray != null) {
            for (JsonObject obj : settingsArray.getValuesAs(JsonObject.class)) {
                String name = obj.getString(Setting.NAME);
                if (name != null) {
                    this.settings.get(name).updateWith(obj);
                }
            }
        }

        JsonArray parametersArray = config.getJsonArray(NODE_PARAMETERS);
        if (parametersArray != null) {
            this.parameters.clear();
            for (JsonObject obj : parametersArray.getValuesAs(JsonObject.class)) {
                Parameter newParam = new Parameter();
                if (newParam.updateWith(obj)) {
                    this.parameters.put(newParam.name, newParam);
                }
            }
        }
    }

    public JsonObject getConfig() {
        return Json.createObjectBuilder()
            .add(NODE_SETTINGS, this.getNode(this.settings))
            .add(NODE_PARAMETERS, this.getNode(this.parameters))
            .build();
    }

    private static JsonArray getNode(Map<String, ? extends ConfigObject> node) {
        JsonArrayBuilder builder = Json.createArrayBuilder();
        for (Entry<String, ? extends ConfigObject> e : node.entrySet()) {
            builder = builder.add(e.getValue().toJsonObject());
        }
        return builder.build();
    }

    public static boolean isValidType(String s) {
        return s != null && typeSet.contains(s);
    }

    public static boolean isValidGroup(String s) {
        return s != null && groupSet.contains(s);
    }

}
