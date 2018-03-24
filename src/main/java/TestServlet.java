import java.io.*;
import javax.json.*;
import javax.servlet.annotation.*;
import javax.servlet.http.*;

@WebServlet("/test")
public class TestServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpUtil.setCORSHeaders(response);
        response.setContentType(Constants.MIME_JSON);
        try (PrintWriter out = response.getWriter()) {
            JsonObject reply = Json.createObjectBuilder()
                .add("message", "Hello!")
                .build();
            out.print(reply.toString());
        }
    }
}