import javax.json.*;

public class Theme extends ConfigObject {

    public String name;
    public String primaryColor;
    public boolean invertPrimary;
    public String accentColor;
    public boolean invertAccent;
    public String warnColor;
    public boolean invertWarn;

    public Theme() {
        this.name = "";
        this.primaryColor = "";
        this.invertPrimary = false;
        this.accentColor = "";
        this.invertAccent = false;
        this.warnColor = "";
        this.invertWarn = false;
    }

    public Theme(String n, String pc, boolean ip, String ac, boolean ia, String wc, boolean iw) {
        this.name = n;
        this.primaryColor = pc;
        this.invertPrimary = ip;
        this.accentColor = ac;
        this.invertAccent = ia;
        this.warnColor = wc;
        this.invertWarn = iw;
    }

    public Theme(JsonObject obj) {
        this();
        this.updateWith(obj);
    }

    public boolean updateWith(JsonObject obj) {
        if (isValidObject(obj)) {
            this.name = Util.getStringSafeNonNull(obj, NAME);
            this.primaryColor = Util.getStringSafeNonNull(obj, PRIMARY_COLOR);
            this.invertPrimary = obj.getBoolean(INVERT_PRIMARY);
            this.accentColor = Util.getStringSafeNonNull(obj, ACCENT_COLOR);
            this.invertAccent = obj.getBoolean(INVERT_ACCENT);
            this.warnColor = Util.getStringSafeNonNull(obj, WARN_COLOR);
            this.invertWarn = obj.getBoolean(INVERT_WARN);
            return true;
        }
        return false;
    }

    public JsonObject toJsonObject() {
        return Json.createObjectBuilder()
            .add(NAME, this.name)
            .add(PRIMARY_COLOR, this.primaryColor)
            .add(INVERT_PRIMARY, Util.getJsonBoolean(this.invertPrimary))
            .add(ACCENT_COLOR, this.accentColor)
            .add(INVERT_ACCENT, Util.getJsonBoolean(this.invertAccent))
            .add(WARN_COLOR, this.warnColor)
            .add(INVERT_WARN, Util.getJsonBoolean(this.invertWarn))
            .build();
    }

    public static boolean isValidObject(JsonObject obj) {
        return obj != null && !Util.getStringSafeNonNull(obj, PRIMARY_COLOR).equals("") && !Util.getStringSafeNonNull(obj, ACCENT_COLOR).equals("")
            && !Util.getStringSafeNonNull(obj, WARN_COLOR).equals("") && obj.get(INVERT_PRIMARY) != null && obj.get(INVERT_ACCENT) != null
            && obj.get(INVERT_WARN) != null;
    }

    @Override
    public boolean equals(Object other) {
        if (other != null && other instanceof Theme) {
            Theme otherAsTheme = (Theme) other;
            return this.name.equals(otherAsTheme.name) && this.primaryColor.equals(otherAsTheme.primaryColor) && this.accentColor.equals(otherAsTheme.accentColor)
                && this.warnColor.equals(otherAsTheme.warnColor) && this.invertPrimary == otherAsTheme.invertPrimary && this.invertAccent == otherAsTheme.invertAccent
                && this.invertWarn == otherAsTheme.invertWarn;
        }
        return false;
    }

}
