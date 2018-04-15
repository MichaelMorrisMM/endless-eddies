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

    public static final String COMMAND = "command";
    public String command;

    public ConfigSettings() {
        this.settings = new HashMap<>();
        this.settings.put(SETTING_ALLOW_GUEST_MODE, new Setting(SETTING_ALLOW_GUEST_MODE, JsonValue.FALSE, GROUP_USERS, TYPE_FLAG));
        this.settings.put(SETTING_ALLOW_GOOGLE_AUTH, new Setting(SETTING_ALLOW_GOOGLE_AUTH, JsonValue.FALSE, GROUP_USERS, TYPE_FLAG));
        this.settings.put(SETTING_ALLOW_GITHUB_AUTH, new Setting(SETTING_ALLOW_GITHUB_AUTH, JsonValue.FALSE, GROUP_USERS, TYPE_FLAG));

        this.parameters = new HashMap<>();

        this.command = "";
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

        try {
            this.command = config.getString(COMMAND);
        } catch (NullPointerException e) {
        }
    }

    public JsonObject getConfig() {
        return Json.createObjectBuilder()
            .add(NODE_SETTINGS, this.getNode(this.settings))
            .add(NODE_PARAMETERS, this.getSortedNode(this.parameters, new SortOrderComparator()))
            .add(COMMAND, this.command)
            .build();
    }

    public List<Parameter> getParameters() {
        List<Parameter> list = new ArrayList<>(this.parameters.values());
        Collections.sort(list, new SortOrderComparator());
        return list;
    }

    private static <T extends ConfigObject> JsonArray getNode(Map<String, T> node) {
        JsonArrayBuilder builder = Json.createArrayBuilder();
        for (Entry<String, T> e : node.entrySet()) {
            builder = builder.add(e.getValue().toJsonObject());
        }
        return builder.build();
    }

    private static <T extends ConfigObject> JsonArray getSortedNode(Map<String, T> node, Comparator<T> comparator) {
        JsonArrayBuilder builder = Json.createArrayBuilder();
        List<T> list = new ArrayList<>(node.values());
        Collections.sort(list, comparator);
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

    public static class SortOrderComparator implements Comparator<Parameter> {

        public int compare(Parameter a, Parameter b) {
            return a.sortOrder - b.sortOrder;
        }
    }

}
