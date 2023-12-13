package fpt.capstone.buildingmanagementsystem.until;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.filter.OncePerRequestFilter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Configuration
public class HttpToHttpsRedirectFilter {
    @Bean
    public FilterRegistrationBean<OncePerRequestFilter> httpsRedirectFilter() {
        FilterRegistrationBean<OncePerRequestFilter> filterRegBean = new FilterRegistrationBean<>();
        filterRegBean.setFilter(new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
                    throws ServletException, IOException {
                if (!request.isSecure()) {
                    String redirectUrl = "https://" + request.getServerName() + ":8081" + request.getRequestURI();
                    response.sendRedirect(redirectUrl);
                } else {
                    filterChain.doFilter(request, response);
                }
            }
        });
        filterRegBean.addUrlPatterns("/*");
        filterRegBean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return filterRegBean;
    }
}
