# Database (Phase 0 draft)

```mermaid
erDiagram
  Category ||--o{ Entry : groups
  Entry ||--o{ Alias : has
  Entry ||--|| Article : canonical
  Article ||--o{ ArticleVersion : versions
  Article ||--o{ ArticleReference : cites
  Reference ||--o{ ArticleReference : used_by
  Article }o--|| User : reviewed_by
  User }o--o{ Role : has
  AuditLog }o--|| User : by
```

Rules: unique slug on Entry, Article, Category; unique normalised text on Alias; FK delete = restrict for Article, cascade for Alias; no whole-content JSON; ArticleVersion is append-only.
