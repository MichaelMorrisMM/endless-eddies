import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpUtil.doPostSetup(response);

        String email = request.getParameter("email");
        if (!Util.isNonEmpty(email)) {
            HttpUtil.printPOSTResult(response, false, "Email must be specified");
            return;
        }

        String password = request.getParameter("password");
        if (!Util.isNonEmpty(password)) {
            HttpUtil.printPOSTResult(response, false, "Password must be specified");
            return;
        }

        User user = DatabaseConnector.getUserByEmail(email);
        if (user == null) {
            HttpUtil.printPOSTResult(response, false, "Unable to retrieve user with specified email");
            return;
        }
        if (!PasswordUtil.verifyPassword(password, user.password, user.salt)) {
            HttpUtil.printPOSTResult(response, false, "Incorrect password");
            return;
        }

        HttpUtil.printPOSTResult(response, true, "Login successful");
    }

}
