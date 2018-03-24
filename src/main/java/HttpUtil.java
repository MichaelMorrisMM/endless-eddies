import javax.servlet.http.HttpServletResponse;

public class HttpUtil {

    public static void setCORSHeaders(HttpServletResponse response) {
        if (Settings.HTTP_ALLOW_CORS_LOCALHOST) {
            response.setHeader("Access-Control-Allow-Origin", Settings.LOCALHOST_DEV_SERVER);
            response.setHeader("Vary", Settings.LOCALHOST_DEV_SERVER);
        }
    }
}
