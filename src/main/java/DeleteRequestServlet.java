import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

@WebServlet("/delete-request")
public class DeleteRequestServlet extends HttpServlet {

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        User user = SessionManager.checkSession(request);
        if (user == null) {
            HttpUtil.printPOSTResult(response, false, "No user session");
            return;
        }
        if (!SessionManager.checkXSRFToken(request)) {
            HttpUtil.printPOSTResult(response, false, "Invalid XSRF token");
            return;
        }

        String idRequestToDeleteString = request.getParameter("idRequest");
        if (!Util.isNonEmpty(idRequestToDeleteString)) {
            HttpUtil.printPOSTResult(response, false, "No request specified");
            return;
        }
        int idRequestToDelete = Integer.parseInt(idRequestToDeleteString);

        if (DatabaseConnector.userCanManageRequest(user, idRequestToDelete)) {
            if (DatabaseConnector.deleteRequest(idRequestToDelete)) {
                HttpUtil.printPOSTResult(response, true, "Request and its files were deleted");
            } else {
                HttpUtil.printPOSTResult(response, false, "An error occurred");
            }
        } else {
            HttpUtil.printPOSTResult(response, false, "Invalid permissions");
        }
    }

}
