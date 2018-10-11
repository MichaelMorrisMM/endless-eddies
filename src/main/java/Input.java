import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Part;

public class Input {

    public String code;
    public String value;
    public Part part;
    public String type;

    public Input() {
        this.code = "";
        this.value = "";
        this.type = "";
        this.part = null;
    }

    public Input(Parameter param, HttpServletRequest request) throws Exception {
        this();

        this.code = param.code.trim();
        this.type = param.type;
        if (param.type.equals(ConfigSettings.TYPE_FILE)) {
            this.part = request.getPart(param.name);
            this.value = this.part.getSubmittedFileName();
        } else {
            this.value = parseValue(param, request);
        }
    }

    private String parseValue(Parameter param, HttpServletRequest request) {
        try {
            String val = request.getParameter(param.name);
            if (param.type.equals(ConfigSettings.TYPE_FLAG)) {
                return Util.parseFlagParameter(val) ? this.code : "";
            } else {
                return val;
            }
        } catch (Exception e) {
            return "";
        }
    }

    public boolean hasCodeToInsert() {
        if (this.type.equals(ConfigSettings.TYPE_FLAG)) {
            return false;
        }

        return this.hasValue() && Util.isNonEmpty(this.code);
    }

    public boolean hasValue() {
        return Util.isNonEmpty(this.value);
    }

}
