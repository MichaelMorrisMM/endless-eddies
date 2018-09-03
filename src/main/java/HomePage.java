import javax.json.*;

public class HomePage extends ConfigObject {

    public String title;
    public String content;

    public HomePage() {
        this.title = "";
        this.content = "";
    }

    public HomePage(String t, String c) {
        this.title = t;
        this.content = c;
    }

    public HomePage(JsonObject obj) {
        this();
        this.updateWith(obj);
    }

    public boolean updateWith(JsonObject obj) {
        if (isValidObject(obj)) {
            this.title = Util.getStringSafeNonNull(obj, TITLE);
            this.content = Util.getStringSafeNonNull(obj, CONTENT);
            return true;
        }
        return false;
    }

    public JsonObject toJsonObject() {
        return Json.createObjectBuilder()
            .add(TITLE, this.title)
            .add(CONTENT, this.content)
            .build();
    }

    public static boolean isValidObject(JsonObject obj) {
        return obj != null && Util.getStringSafe(obj, TITLE) != null && Util.getStringSafe(obj, CONTENT) != null && !Util.getStringSafe(obj, TITLE).equals("") && !Util.getStringSafe(obj, CONTENT).equals("");
    }

    @Override
    public boolean equals(Object other) {
        if (other != null && other instanceof HomePage) {
            HomePage otherAsHP = (HomePage) other;
            return this.title.equals(otherAsHP.title) && this.content.equals(otherAsHP.content);
        }
        return false;
    }

}
