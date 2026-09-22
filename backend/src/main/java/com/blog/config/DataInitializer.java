package com.blog.config;

import com.blog.entity.*;
import com.blog.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final BlogRepository blogRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (blogRepository.count() > 0) {
            log.info("Blogs already seeded. Skipping initialization.");
            return;
        }

        log.info("Starting database initialization with seed data...");

        User admin = userRepository.findByEmail("admin@blogspace.com").orElseGet(() -> {
            User u = User.builder()
                    .name("Admin User")
                    .email("admin@blogspace.com")
                    .password(passwordEncoder.encode("admin123"))
                    .profileImage("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80")
                    .bio("Lead platform administrator and software architect.")
                    .role(Role.ROLE_ADMIN)
                    .build();
            return userRepository.save(u);
        });

        User author = userRepository.findByEmail("sujay@gmail.com").orElseGet(() -> {
            User u = User.builder()
                    .name("Sujay")
                    .email("sujay@gmail.com")
                    .password(passwordEncoder.encode("password123"))
                    .profileImage("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80")
                    .bio("Java Full Stack developer passionate about Spring Boot, React, and scalable backend architectures.")
                    .role(Role.ROLE_USER)
                    .build();
            return userRepository.save(u);
        });

        // 2. Categories
        Category catSpring = getOrCreateCategory("Spring Boot", "Enterprise Java frameworks, REST APIs, and microservices");
        Category catReact = getOrCreateCategory("React", "Modern frontend development, hooks, state management, and UI libraries");
        Category catDatabase = getOrCreateCategory("PostgreSQL", "Relational database design, indexing, performance tuning, and SQL");
        Category catArchitecture = getOrCreateCategory("System Design", "Architectural patterns, security, scalability, and cloud deployments");
        getOrCreateCategory("Java", "Core Java 21 features, virtual threads, streams, and concurrency");

        // 3. Tags
        Tag tagSpring = getOrCreateTag("springboot");
        Tag tagReact = getOrCreateTag("react");
        Tag tagPostgres = getOrCreateTag("postgresql");
        Tag tagJwt = getOrCreateTag("jwt");
        Tag tagTailwind = getOrCreateTag("tailwindcss");
        Tag tagFullstack = getOrCreateTag("fullstack");

        // 4. Sample Blogs
        Blog blog1 = Blog.builder()
                .title("Architecting a Production-Grade Blog Application with Spring Boot 3 & React")
                .slug("architecting-production-grade-blog-app-spring-boot-react")
                .summary("Explore the end-to-end architecture of a modern full-stack web application featuring Spring Boot, PostgreSQL, JWT Authentication, and React.")
                .thumbnail("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80")
                .status(BlogStatus.PUBLISHED)
                .author(author)
                .category(catSpring)
                .tags(new HashSet<>(List.of(tagSpring, tagReact, tagFullstack)))
                .content("""
# Architecting a Production-Grade Blog Application

When preparing for a Java Full Stack internship, developing a full-fledged application from scratch demonstrates an in-depth grasp of both backend robustness and responsive user experience.

---

## 1. Backend Design with Spring Boot 3
The backend is structured around domain-driven design principles:
- **Spring Security 6 & JWT**: Completely stateless authentication with customized `OncePerRequestFilter`.
- **Spring Data JPA & Hibernate**: Entity relationships such as `@ManyToOne` for authors/categories and `@ManyToMany` for tags.
- **PostgreSQL Database**: Industry-standard relational storage optimized with foreign keys and unique constraints.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http.csrf(AbstractHttpConfigurer::disable)
                   .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                   .authorizeHttpRequests(a -> a.anyRequest().authenticated())
                   .build();
    }
}
```

---

## 2. Dynamic Frontend with React & Tailwind CSS
A clean client architecture uses Axios interceptors to automatically attach the Bearer token, React Router for seamless single-page navigation, and Tailwind CSS for a sleek visual presentation.

Stay tuned as we dive deeper into each layer in future posts!
""")
                .build();
        blog1 = blogRepository.save(blog1);

        Blog blog2 = Blog.builder()
                .title("Mastering JWT Authentication and Role-Based Authorization in Spring Security 6")
                .slug("mastering-jwt-auth-role-based-authorization-spring-security-6")
                .summary("A comprehensive guide to implementing stateless JSON Web Token security, role hierarchies, and secure password hashing with BCrypt.")
                .thumbnail("https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80")
                .status(BlogStatus.PUBLISHED)
                .author(author)
                .category(catArchitecture)
                .tags(new HashSet<>(List.of(tagSpring, tagJwt)))
                .content("""
# Mastering JWT Authentication in Spring Security 6

Security is one of the most critical aspects of enterprise application design. In modern microservice and single-page architectures, session cookies are frequently replaced by stateless **JSON Web Tokens (JWT)**.

---

### Why Stateless Authentication?
1. **Horizontal Scalability**: No session state is held in server memory; any cluster node can validate incoming requests.
2. **Cross-Platform Mobility**: Identical tokens can seamlessly authorize web, mobile, and third-party API clients.
3. **Decentralized Claims**: User roles, username, and token expiration are securely packed inside the payload cryptographically signed with HMAC-SHA256.

```java
String token = Jwts.builder()
    .subject(userDetails.getUsername())
    .issuedAt(new Date())
    .expiration(new Date(System.currentTimeMillis() + 86400000))
    .signWith(getSigningKey(), Jwts.SIG.HS256)
    .compact();
```

By ensuring passwords are encrypted with `BCryptPasswordEncoder` and filtering each request via a high-performance `JwtAuthenticationFilter`, your APIs remain resilient and secure.
""")
                .build();
        blog2 = blogRepository.save(blog2);

        Blog blog3 = Blog.builder()
                .title("Building Fast and Responsive UIs with React 18, Vite, and Tailwind CSS")
                .slug("building-fast-responsive-uis-react-18-vite-tailwind")
                .summary("Learn modern frontend practices: component modularity, reactive state hooks, utility-first CSS styling, and seamless REST API consumption.")
                .thumbnail("https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80")
                .status(BlogStatus.PUBLISHED)
                .author(admin)
                .category(catReact)
                .tags(new HashSet<>(List.of(tagReact, tagTailwind)))
                .content("""
# Building Fast and Responsive UIs with React and Tailwind CSS

User interface development has evolved tremendously with tools like **Vite** and **Tailwind CSS**. Gone are the days of slow webpack reloads and messy global stylesheets.

---

### Key Benefits of Tailwind CSS
- **Utility-First**: Style directly in your JSX with clean, consistent utility classes.
- **Micro-interactions**: Easy hover, focus, and transition effects.
- **Design System Consistency**: Uniform colors, shadows, border radii, and typographic rhythm.

```jsx
<button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg transition duration-200">
  Create Blog
</button>
```

Combine this with React 18's modular component design and context providers for authorization, and you have an incredible developer and user experience.
""")
                .build();
        blog3 = blogRepository.save(blog3);

        Blog blog4 = Blog.builder()
                .title("PostgreSQL Optimization: Indexing and Relational Modeling for High Throughput")
                .slug("postgresql-optimization-indexing-relational-modeling")
                .summary("Discover how to design database schemas with unique constraints, indexing strategies, and optimized foreign key relationships in PostgreSQL.")
                .thumbnail("https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80")
                .status(BlogStatus.PUBLISHED)
                .author(author)
                .category(catDatabase)
                .tags(new HashSet<>(List.of(tagPostgres, tagSpring)))
                .content("""
# PostgreSQL Optimization and Schema Modeling

Databases are the foundation of every robust web application. With PostgreSQL, developers get unmatched reliability, powerful query planners, and strong ACID compliance.

### Critical Database Best Practices:
1. **Unique Constraints**: Prevent duplicate likes (`UNIQUE(user_id, blog_id)`) and duplicate user emails directly at the database engine level.
2. **Proper Foreign Keys**: Maintain referential integrity across users, posts, categories, and comments with cascading deletes where appropriate.
3. **Optimized Pagination**: Utilize `LIMIT` and `OFFSET` via Spring Data JPA's `PageRequest` to keep memory overhead predictable.
""")
                .build();
        blog4 = blogRepository.save(blog4);

        // 5. Sample Comments & Likes
        Comment comment1 = Comment.builder()
                .content("This architecture guide is incredible! The explanation of stateless security and JPA relationships is crystal clear.")
                .blog(blog1)
                .user(admin)
                .build();
        commentRepository.save(comment1);

        Comment comment2 = Comment.builder()
                .content("Great article! Looking forward to seeing the frontend integration with React and Axios.")
                .blog(blog1)
                .user(author)
                .build();
        commentRepository.save(comment2);

        Like like1 = Like.builder().blog(blog1).user(admin).build();
        Like like2 = Like.builder().blog(blog1).user(author).build();
        Like like3 = Like.builder().blog(blog2).user(author).build();
        likeRepository.saveAll(List.of(like1, like2, like3));

        log.info("Database initialized successfully with 2 users, 5 categories, 6 tags, 4 blogs, 2 comments, and 3 likes!");
    }

    private Category getOrCreateCategory(String name, String description) {
        return categoryRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> categoryRepository.save(Category.builder().name(name).description(description).build()));
    }

    private Tag getOrCreateTag(String name) {
        return tagRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> tagRepository.save(Tag.builder().name(name).build()));
    }
}
