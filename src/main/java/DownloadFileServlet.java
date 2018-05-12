import javax.json.Json;
import javax.json.JsonReader;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

@WebServlet("/download-file")
public class DownloadFileServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            HttpUtil.doGetSetup(response);
            ConfigSettings config = ConfiguratorServlet.getCurrentConfig();
            String requestName = request.getParameter("requestName");
            String filename = request.getParameter("filename");
            if (Util.isNonEmpty(requestName) && Util.isNonEmpty(filename)) {
                File file = new File(ConfiguratorServlet.ROOT_PATH + File.separator + requestName + File.separator + filename);
                if (file.exists() && file.isFile() && file.canRead()) {
                    HttpUtil.downloadFile(response, file);
                    return;
                }
            }

            HttpUtil.printJSONResponse(response, Json.createObjectBuilder()
                .add("result", "INVALID PARAMS")
                .build());
        } catch (Exception e) {
            HttpUtil.printJSONResponse(response, Json.createObjectBuilder()
                .add("result", "ERROR")
                .build());
        }
    }

}
