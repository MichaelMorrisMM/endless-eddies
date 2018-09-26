import javax.json.*;

public class Theme extends ConfigObject {

    public String name;
    public String primaryColor;
    public String accentColor;
    public String warnColor;

    public Theme() {
        this.name = "";
        this.primaryColor = "";
        this.accentColor = "";
        this.warnColor = "";
    }

    public Theme(String n, String pc, String ac, String wc) {
        this.name = n;
        this.primaryColor = pc;
        this.accentColor = ac;
        this.warnColor = wc;
    }

    public Theme(JsonObject obj) {
        this();
        this.updateWith(obj);
    }

    public boolean updateWith(JsonObject obj) {
        if (isValidObject(obj)) {
            this.name = Util.getStringSafeNonNull(obj, NAME);
            this.primaryColor = Util.getStringSafeNonNull(obj, PRIMARY_COLOR);
            this.accentColor = Util.getStringSafeNonNull(obj, ACCENT_COLOR);
            this.warnColor = Util.getStringSafeNonNull(obj, WARN_COLOR);
            return true;
        }
        return false;
    }

    public JsonObject toJsonObject() {
        return Json.createObjectBuilder()
            .add(NAME, this.name)
            .add(PRIMARY_COLOR, this.primaryColor)
            .add(ACCENT_COLOR, this.accentColor)
            .add(WARN_COLOR, this.warnColor)
            .build();
    }

    public static boolean isValidObject(JsonObject obj) {
        return obj != null && !Util.getStringSafeNonNull(obj, PRIMARY_COLOR).equals("") && !Util.getStringSafeNonNull(obj, ACCENT_COLOR).equals("") && !Util.getStringSafeNonNull(obj, WARN_COLOR).equals("");
    }

    @Override
    public boolean equals(Object other) {
        if (other != null && other instanceof Theme) {
            Theme otherAsTheme = (Theme) other;
            return this.name.equals(otherAsTheme.name) && this.primaryColor.equals(otherAsTheme.primaryColor) && this.accentColor.equals(otherAsTheme.accentColor)
                && this.warnColor.equals(otherAsTheme.warnColor);
        }
        return false;
    }

}
