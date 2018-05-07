import javax.json.*;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.*;
import java.util.Map.Entry;

public class ConfigSettings {

    public static final String TYPE_FLAG = "flag";
    public static final String TYPE_STRING = "string";
    public static final String TYPE_INTEGER = "integer";
    public static final String TYPE_FLOAT = "float";
    public static final String TYPE_SELECT = "select";
    private static Set<String> typeSet;
    static {
        typeSet = new HashSet<>();
        typeSet.add(TYPE_FLAG);
        typeSet.add(TYPE_STRING);
        typeSet.add(TYPE_INTEGER);
        typeSet.add(TYPE_FLOAT);
        typeSet.add(TYPE_SELECT);
    }

    public static final String GROUP_USERS = "users";
    private static Set<String> groupSet;
    static {
        groupSet = new HashSet<>(1);
        groupSet.add(GROUP_USERS);
    }

    public static final String NODE_SETTINGS = "settings";
    public static final String NODE_APPLICATIONS = "applications";
    public static final String TARGET_APPLICATION = "targetApplication";

    public static final String SETTING_ALLOW_GUEST_MODE = "allow_guest_mode";
    public static final String SETTING_ALLOW_GOOGLE_AUTH = "allow_google_auth";
    public static final String SETTING_ALLOW_GITHUB_AUTH = "allow_github_auth";

    private Map<String, Setting> settings;
    private List<Application> applications;

    public ConfigSettings() {
        this.settings = new HashMap<>();
        this.settings.put(SETTING_ALLOW_GUEST_MODE, new Setting(SETTING_ALLOW_GUEST_MODE, JsonValue.FALSE, GROUP_USERS, TYPE_FLAG));
        this.settings.put(SETTING_ALLOW_GOOGLE_AUTH, new Setting(SETTING_ALLOW_GOOGLE_AUTH, JsonValue.FALSE, GROUP_USERS, TYPE_FLAG));
        this.settings.put(SETTING_ALLOW_GITHUB_AUTH, new Setting(SETTING_ALLOW_GITHUB_AUTH, JsonValue.FALSE, GROUP_USERS, TYPE_FLAG));

        this.applications = new ArrayList<>();
    }

    public ConfigSettings(File configFile) throws FileNotFoundException {
        this();
        try (JsonReader reader = Json.createReader(new FileReader(configFile))) {
            this.updateWithConfig(reader.readObject());
        }
    }

    public void updateWithConfig(JsonObject config) {
        try {
            JsonArray settingsArray = Util.getArraySafe(config, NODE_SETTINGS);
            if (settingsArray != null) {
                for (JsonObject obj : settingsArray.getValuesAs(JsonObject.class)) {
                    String name = Util.getStringSafe(obj, ConfigObject.NAME);
                    if (name != null && this.settings.containsKey(name)) {
                        this.settings.get(name).updateWith(obj);
                    }
                }
            }

            JsonArray applicationsArray = Util.getArraySafe(config, NODE_APPLICATIONS);
            if (applicationsArray != null) {
                this.applications.clear();
                for (JsonObject obj : applicationsArray.getValuesAs(JsonObject.class)) {
                    Application newApp = new Application();
                    if (newApp.updateWith(obj)) {
                        this.applications.add(newApp);
                    }
                }
            }
        } catch (Exception e) {
        }
    }

    public Application getApplication(String name) {
        if (name != null && !name.equals("")) {
            for (Application a : this.applications) {
                if (a.name.equals(name)) {
                    return a;
                }
            }
        }
        return null;
    }

    public JsonObject getConfig() {
        return Json.createObjectBuilder()
            .add(NODE_SETTINGS, getNode(this.settings))
            .add(NODE_APPLICATIONS, getNode(this.applications))
            .build();
    }

    public static <T extends ConfigObject> JsonArray getNode(List<T> node) {
        JsonArrayBuilder builder = Json.createArrayBuilder();
        for (T e : node) {
            builder = builder.add(e.toJsonObject());
        }
        return builder.build();
    }

    public static <T extends ConfigObject> JsonArray getNode(Map<String, T> node) {
        JsonArrayBuilder builder = Json.createArrayBuilder();
        for (Entry<String, T> e : node.entrySet()) {
            builder = builder.add(e.getValue().toJsonObject());
        }
        return builder.build();
    }

    public static <T extends ConfigObject> JsonArray getSortedNode(Map<String, T> node, Comparator<T> comparator) {
        JsonArrayBuilder builder = Json.createArrayBuilder();
        List<T> list = new ArrayList<>(node.values());
        list.sort(comparator);
        for (T obj : list) {
            builder = builder.add(obj.toJsonObject());
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
