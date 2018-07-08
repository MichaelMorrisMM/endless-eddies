import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

@WebServlet("/manage-expired-results")
public class ManageExpiredResultsServlet extends HttpServlet {

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        User user = SessionManager.checkAdminSession(request);
        if (user == null) {
            HttpUtil.printPOSTResult(response, false, "No admin user session");
            return;
        }
        if (!SessionManager.checkXSRFToken(request)) {
            HttpUtil.printPOSTResult(response, false, "Invalid XSRF token");
            return;
        }

        int result = DatabaseConnector.deleteExpiredResults();
        if (result < 0) {
            HttpUtil.printPOSTResult(response, false, "An error occurred");
        } else if (result > 0) {
            HttpUtil.printPOSTResult(response, true, "" + result + " expired request(s) deleted");
        } else {
            HttpUtil.printPOSTResult(response, true, "No expired request(s) to delete");
        }
    }

}
