import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

public class SessionManager {

    private static final String SESSION_COOKIE_NAME = "SESSION";
    private static Algorithm ALGORITHM;

    static {
        SecureRandom srandom = new SecureRandom();
        byte[] secret = new byte[64];
        srandom.nextBytes(secret);
        ALGORITHM = Algorithm.HMAC512(secret);
    }

    public static boolean createSession(User user, HttpServletResponse response) {
        try {
            Instant now = Instant.now();
            String jwt = JWT.create()
                .withIssuedAt(Date.from(now))
                .withExpiresAt(Date.from(now.plus(1, ChronoUnit.HOURS)))
                .withClaim("email", user.email)
                .sign(ALGORITHM);
            Cookie sessionCookie = new Cookie(SESSION_COOKIE_NAME, jwt);
            // TODO add secure when https is working
            sessionCookie.setHttpOnly(true);
            response.addCookie(sessionCookie);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static User getSession(HttpServletRequest request) {
        try {
            Cookie[] cookies = request.getCookies();
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(SESSION_COOKIE_NAME) && cookie.getValue() != null) {
                    DecodedJWT jwt = JWT.require(ALGORITHM).build().verify(cookie.getValue());
                    Instant now = Instant.now();
                    if (now.compareTo(jwt.getIssuedAt().toInstant()) > 0 && now.compareTo(jwt.getExpiresAt().toInstant()) < 0) {
                        return DatabaseConnector.getUserByEmail(jwt.getClaim("email").asString());
                    }
                }
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }

}
