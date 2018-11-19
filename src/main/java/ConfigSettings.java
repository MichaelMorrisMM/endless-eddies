import javax.json.*;
import java.io.*;
import java.util.*;

public class ConfigSettings {

    public static final String TYPE_FLAG = "flag";
    public static final String TYPE_STRING = "string";
    public static final String TYPE_INTEGER = "integer";
    public static final String TYPE_FLOAT = "float";
    public static final String TYPE_SELECT = "select";
    public static final String TYPE_FILE = "file";
    public static final String TYPE_MULTI_SELECT = "multiselect";
    private static Set<String> typeSet;
    static {
        typeSet = new HashSet<>();
        typeSet.add(TYPE_FLAG);
        typeSet.add(TYPE_STRING);
        typeSet.add(TYPE_INTEGER);
        typeSet.add(TYPE_FLOAT);
        typeSet.add(TYPE_SELECT);
        typeSet.add(TYPE_FILE);
        typeSet.add(TYPE_MULTI_SELECT);
    }

    private static final String NODE_APPLICATIONS = "applications";
    public static final String TARGET_APPLICATION = "targetApplication";

    private List<Application> applications;
    private static final String RESULT_LIFESPAN = "resultLifespanInDays";
    public int resultLifespan;
    private static final String USER_STORAGE_LIMIT = "userStorageLimit";
    public long userStorageLimit;
    private static final String ALLOW_GUEST_MODE = "allowGuestMode";
    public boolean allowGuestMode;
    private static final String ALLOW_GOOGLE_LOGIN = "allowGoogleLogin";
    private boolean allowGoogleLogin;
    private static final String ALLOW_GITHUB_LOGIN = "allowGithubLogin";
    private boolean allowGithubLogin;
    private static final String APP_THEME = "appTheme";
    private Theme appTheme;

    private static final String HOME_PAGES = "homePages";
    private List<HomePage> homePages;

    public ConfigSettings() {
        this.applications = new ArrayList<>();
        this.resultLifespan = 0;
        this.userStorageLimit = 0;
        this.allowGuestMode = false;
        this.allowGoogleLogin = false;
        this.allowGithubLogin = false;
        this.appTheme = new Theme();
        this.homePages = new ArrayList<>();
    }

    public ConfigSettings(File configFile) throws IOException {
        this();
        try (JsonReader reader = Json.createReader(new InputStreamReader(new FileInputStream(configFile), "UTF-8"))) {
            this.updateWithConfig(reader.readObject());
        }
    }

    public void updateWithConfig(JsonObject config) {
        try {
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

            if (config.get(RESULT_LIFESPAN) != null) {
                this.resultLifespan = config.getInt(RESULT_LIFESPAN);
            }
            if (config.get(USER_STORAGE_LIMIT) != null) {
                this.userStorageLimit = config.getInt(USER_STORAGE_LIMIT);
            }
            if (config.get(ALLOW_GUEST_MODE) != null) {
                this.allowGuestMode = config.getBoolean(ALLOW_GUEST_MODE);
            }
            if (config.get(ALLOW_GOOGLE_LOGIN) != null) {
                this.allowGoogleLogin = config.getBoolean(ALLOW_GOOGLE_LOGIN);
            }
            if (config.get(ALLOW_GITHUB_LOGIN) != null) {
                this.allowGithubLogin = config.getBoolean(ALLOW_GITHUB_LOGIN);
            }
            if (config.get(APP_THEME) != null) {
                Theme newTheme = new Theme();
                if (newTheme.updateWith(config.getJsonObject(APP_THEME))) {
                    this.appTheme = newTheme;
                }
            }

            JsonArray homePagesArray = Util.getArraySafe(config, HOME_PAGES);
            if (homePagesArray != null) {
                this.homePages.clear();
                for (JsonObject obj : homePagesArray.getValuesAs(JsonObject.class)) {
                    HomePage newHomePage = new HomePage();
                    if (newHomePage.updateWith(obj)) {
                        this.homePages.add(newHomePage);
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
            .add(NODE_APPLICATIONS, getNode(this.applications))
            .add(RESULT_LIFESPAN, this.resultLifespan)
            .add(USER_STORAGE_LIMIT, this.userStorageLimit)
            .add(ALLOW_GUEST_MODE, this.allowGuestMode)
            .add(ALLOW_GOOGLE_LOGIN, this.allowGoogleLogin)
            .add(ALLOW_GITHUB_LOGIN, this.allowGithubLogin)
            .add(APP_THEME, this.appTheme.toJsonObject())
            .add(HOME_PAGES, getNode(this.homePages))
            .build();
    }

    public static <T extends ConfigObject> JsonArray getNode(List<T> node) {
        JsonArrayBuilder builder = Json.createArrayBuilder();
        for (T e : node) {
            builder = builder.add(e.toJsonObject());
        }
        return builder.build();
    }

    public static boolean isValidType(String s) {
        return s != null && typeSet.contains(s);
    }

}
