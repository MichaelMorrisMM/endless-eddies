import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport
import com.google.api.client.json.jackson2.JacksonFactory
import java.util.*

class GoogleOauth {
    companion object {
        // Environment Variables
        const val CLIENT_ID_ENV_KEY = "EE_GOOGLE_CLIENT_ID"

        // API objects
        const val ID_TOKEN_KEY = "idTokenString"

        fun getUserEmail(idTokenString: String): String {
            val verifier = GoogleIdTokenVerifier
                .Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    JacksonFactory.getDefaultInstance()
                )
                .setAudience(Collections.singletonList(System.getenv(CLIENT_ID_ENV_KEY)))
                .build()

            val idToken = verifier.verify(idTokenString)
            return if (idToken != null) {
                idToken.payload.email
            } else {
                ""
            }
        }
    }
}
