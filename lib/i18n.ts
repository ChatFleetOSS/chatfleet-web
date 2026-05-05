export const translations = {
  en: {
    "layout.userMenu.adminConsole": "Admin console",
    "layout.userMenu.userProfile": "User profile",
    "layout.userMenu.signOut": "Sign out",
    "layout.loadingWorkspace": "Loading your workspace…",
    "layout.footer.build": "Build #{{build}} · {{year}}",

    "dashboard.workspaceOverview": "Workspace overview",
    "dashboard.welcome": "Welcome back, {{name}}",
    "dashboard.defaultName": "operator",
    "dashboard.intro":
      "Choose an assistant to open the chat surface. Data is sourced from",
    "dashboard.error": "Unable to load assistants at the moment.",
    "dashboard.retry": "Retry",
    "dashboard.accessibleAssistants": "Accessible assistants ({{count}})",
    "dashboard.loadingAssistants": "Loading assistants…",
    "dashboard.emptyAssistants":
      "No assistants available yet. Ask an administrator to share one or seed documents from the admin console.",
    "dashboard.select": "Select",
    "dashboard.openAdminConsole": "Open admin console",

    "common.backHome": "Back to home",
    "common.backAdmin": "Back to admin",
    "common.cancel": "Cancel",
    "common.createRag": "Create RAG",
    "common.uploadAndIndex": "Upload & start indexing",
    "common.uploading": "Uploading…",
    "common.save": "Save",
    "common.saving": "Saving…",
    "common.rebuildIndex": "Rebuild index",
    "common.rebuilding": "Rebuilding…",
    "common.opening": "Opening…",
    "common.resetIndex": "Reset index",
    "common.resetting": "Resetting…",
    "common.resetConfirm":
      "Resetting removes all indexed chunks and metadata. Continue?",
    "common.inviteUser": "Invite user",
    "common.remove": "Remove",
    "common.documents": "Documents",
    "common.status": "Status",
    "common.chunks": "Chunks",
    "common.lastUpdated": "Last updated",
    "common.loading": "Loading…",
    "auth.login.heading": "Welcome back",
    "auth.register.heading": "Create an account",
    "auth.login.subtitle": "Sign in to manage your RAG assistants.",
    "auth.login.emailLabel": "Email",
    "auth.login.emailPlaceholder": "you@company.com",
    "auth.login.passwordLabel": "Password",
    "auth.login.passwordPlaceholder": "••••••••",
    "auth.login.authenticating": "Authenticating…",
    "auth.login.submit": "Sign in",
    "auth.register.submit": "Register & sign in",
    "auth.login.toggleToRegister": "Need an account?",
    "auth.register.toggleToLogin": "Already have an account?",
    "auth.login.defaultError": "Unable to authenticate",
    "auth.login.sectionLabel": "Secure access",
    "auth.login.heroBadge": "Your business knowledge. Super-powered.",
    "auth.login.heroTitle": "Operate smarter with ChatFleet",
    "auth.login.heroSubtitle":
      "Turn docs and tools into instant answers — wherever you work.",
    "auth.login.heroTagline":
      "→ Operate smarter. Respond faster. Keep your data yours.",
    "auth.login.heroChooseTitle": "Why growing businesses choose ChatFleet",
    "auth.login.heroPoint1":
      "🚀 Launch in minutes. Upload docs, connect your LLM, deploy to Slack/web.",
    "auth.login.heroPoint2":
      "💬 Everywhere you are. Slack, WhatsApp, Telegram, Notion, web.",
    "auth.login.heroPoint3": "📂 One dashboard for all knowledge.",
    "auth.login.heroPoint4": "🔒 Roles, invites, audit logs — built for teams.",
    "auth.login.heroPoint5": "📊 Live visibility into ingestion and indexing.",
    "auth.login.heroFreedomTitle": "Freedom comes standard",
    "auth.login.heroFreedomPoint1": "🧩 Open‑source. Your code, your control.",
    "auth.login.heroFreedomPoint2": "🛡️ Self‑host for full data ownership.",
    "auth.login.heroFreedomPoint3": "♾️ Unlimited chats, docs, and assistants.",
    "auth.login.heroFreedomPoint4": "💰 Predictable costs. Bring your own LLM.",
    "auth.login.footerSecurity": "Verified workspace · TLS secured",
    "auth.login.footerAgent":
      "Powered by ChatFleet Frontend Integration Agent (Codex Edition).",

    "ragDetail.notAvailable":
      "RAG “{{slug}}” is not available to your account.",
    "ragDetail.loading": "Loading assistant context for {{slug}}…",

    "thread.welcomeTitle": "Hello there!",
    "thread.welcomeSubtitle": "How can I help you today?",
    "thread.suggestion.weather.title": "What's the weather",
    "thread.suggestion.weather.description": "in San Francisco?",
    "thread.suggestion.weather.action": "What's the weather in San Francisco?",
    "thread.suggestion.hooks.title": "Explain React hooks",
    "thread.suggestion.hooks.description": "like useState and useEffect",
    "thread.suggestion.hooks.action":
      "Explain React hooks like useState and useEffect",
    "thread.suggestion.sql.title": "Write a SQL query",
    "thread.suggestion.sql.description": "to find top customers",
    "thread.suggestion.sql.action": "Write a SQL query to find top customers",
    "thread.suggestion.meal.title": "Create a meal plan",
    "thread.suggestion.meal.description": "for healthy weight loss",
    "thread.suggestion.meal.action":
      "Create a meal plan for healthy weight loss",
    "thread.composer.placeholder": "Send a message...",
    "thread.composer.ariaLabel": "Message input",
    "thread.tooltips.send": "Send message",
    "thread.tooltips.cancel": "Stop generating",
    "thread.tooltips.copy": "Copy",
    "thread.tooltips.refresh": "Refresh",
    "thread.tooltips.edit": "Edit message",
    "thread.edit.cancelAria": "Cancel editing",
    "thread.edit.update": "Update",
    "thread.edit.updateAria": "Update message",
    "thread.branch.previous": "Previous",
    "thread.branch.next": "Next",
    "threadList.newThread": "New thread",
    "threadList.archiveTooltip": "Archive thread",
    "threadList.newChatFallback": "New thread",
    "assistant.sources": "Sources",
    "assistant.selector.label": "Choose an assistant",
    "assistant.selector.placeholder": "Select an assistant",
    "assistant.sourcesEntry": "{{position}}. {{filename}} · pages {{pages}}",
    "assistant.error.noContext":
      "No supporting snippets were found. Try rephrasing or uploading documents for this assistant.",
    "thread.suggestionGroupLabel": "Suggested questions",
    "publicRag.list.title": "Public assistants",
    "publicRag.list.subtitle":
      "Anyone can open and chat with these assistants—no login required.",
    "publicRag.list.empty": "No public assistants yet.",
    "publicRag.open": "Open",
    "publicRag.back": "Back to public list",
    "publicRag.docsTitle": "Documents",
    "publicRag.metadataTitle": "Metadata",
    "publicRag.visibility.public": "Public",
    "publicRag.hero.subtitle":
      "Anyone can chat with this assistant — no login required.",
    "publicRag.hero.descriptionFallback":
      "This assistant is public. Start a conversation or browse the source documents below.",
    "publicRag.description.missing":
      "This assistant is public. Start chatting to explore its knowledge.",
    "publicRag.prompt.title": "Ask your question",
    "publicRag.prompt.subtitle":
      "Describe what you need. The suggestions below can help you start.",
    "publicRag.composer.placeholder":
      "e.g., How do I declare and manipulate arrays in Perl?",
    "publicRag.suggestions.title": "Suggestions",
    "publicRag.suggestions.q1": "What are the core concepts covered here?",
    "publicRag.suggestions.q2":
      "Can you summarize the key steps to get started?",
    "publicRag.suggestions.q3": "How do I work with arrays in this guide?",
    "publicRag.suggestions.q4": "Share a quick example I can reuse.",
    "publicRag.answerLabel": "Answer sourced from the documentation",
    "admin.ragSection.empty":
      "No RAG instances available. Use the create button above to add one.",
    "admin.manage": "Manage",
    "admin.language.label": "Interface language",
    "admin.language.english": "English",
    "admin.language.french": "French",
    "admin.language.description": "Switch the workspace interface language.",
    "admin.language.helper":
      "This preference is stored locally for your device.",
    "admin.header.overview": "Administration console",
    "admin.header.title": "Control surface",
    "admin.header.subtitle":
      "Review runtime settings, users, and RAG workspaces from one place.",
    "admin.runtime.title": "Runtime configuration",
    "admin.runtime.description":
      "Review the values currently applied to the runtime.",
    "admin.runtime.chatModel": "Chat model",
    "admin.runtime.embeddingModel": "Embedding model",
    "admin.runtime.indexDir": "Index directory",
    "admin.runtime.uploadDir": "Upload directory",
    "admin.runtime.maxUpload": "Maximum upload size",
    "admin.runtime.loading": "Loading configuration…",
    "admin.users.title": "Users",
    "admin.users.subtitle": "Track who currently has access to the platform.",
    "admin.users.loading": "Loading users…",
    "admin.users.total": "Total users",
    "admin.users.admins": "Administrators",
    "admin.ragSection.title": "RAG instances",
    "admin.ragSection.subtitle":
      "Manage existing knowledge bases. Use the button above to create new ones.",
    "admin.ragSection.loading": "Loading RAGs…",

    "adminRag.manageHeading": "Managing RAG",
    "adminRag.subtitle":
      "Upload documents, rebuild/reset the index, and manage user access for this assistant.",
    "adminRag.metadata.title": "Metadata",
    "adminRag.metadata.loading": "Loading metadata…",
    "adminRag.metadata.description":
      "RAG metadata could not be found. Provision the slug via backend tooling and retry.",
    "adminRag.metadata.return": "Return to admin dashboard",
    "adminRag.metadata.slug": "Slug",
    "adminRag.metadata.name": "Name",
    "adminRag.metadata.descriptionLabel": "Description",
    "adminRag.metadata.indexedChunks": "Indexed chunks",
    "adminRag.metadata.lastUpdated": "Last updated",
    "adminRag.prompt.title": "Response instructions",
    "adminRag.prompt.description":
      "Tune how this assistant answers without changing the indexed documents.",
    "adminRag.prompt.loading": "Loading response instructions…",
    "adminRag.prompt.label": "System prompt",
    "adminRag.prompt.help":
      "Applies to the next conversations. It does not rebuild the index. Reset to restore the default RAG prompt.",
    "adminRag.prompt.save": "Save prompt",
    "adminRag.prompt.reset": "Reset to default",
    "adminRag.prompt.saved": "Prompt saved.",
    "adminRag.docs.title": "Document ingestion",
    "adminRag.docs.instructions":
      "Accepted formats: PDF, DOCX, TXT, ODT, ODS, or ODP. Maximum size is enforced by the backend.",
    "adminRag.docs.unavailable":
      "Documents become available once the RAG is provisioned.",
    "adminRag.errors.metadataUnavailable": "RAG metadata unavailable.",
    "adminRag.errors.selectFiles":
      "Select at least one PDF, DOCX, TXT, ODT, ODS, or ODP file to upload.",
    "adminRag.docs.latestJob": "Latest upload job: {{id}}",
    "adminRag.docs.filename": "Filename",
    "adminRag.visibility.label": "Visibility",
    "adminRag.visibility.private": "Private (only shared users can chat)",
    "adminRag.visibility.public": "Public (anyone with the link can chat)",
    "adminRag.index.title": "Index maintenance",
    "adminRag.index.unavailable":
      "Index actions become available once the RAG is provisioned.",
    "adminRag.index.latestRebuild": "Latest rebuild job: {{id}}",
    "adminRag.index.latestReset": "Latest reset job: {{id}}",
    "adminRag.users.title": "User access",
    "adminRag.users.unavailable": "Provision the RAG to invite collaborators.",
    "adminRag.users.placeholder": "user@company.com",
    "adminRag.users.empty": "No users yet. Invite teammates above.",
    "adminRag.docs.empty": "No documents uploaded yet.",
    "adminRag.docs.count": "Documents ({{count}})",
    "adminRag.sections.metadataDescription":
      "Review key attributes for this RAG instance.",
    "adminRag.sections.documentsDescription":
      "Upload documents (PDF, DOCX, TXT, ODT, ODS, ODP) to enrich the knowledge base.",
    "adminRag.sections.indexDescription":
      "Run maintenance jobs to refresh or reset embeddings.",
    "adminRag.sections.usersDescription":
      "Manage who can access this assistant.",
    "adminRag.sections.catalogDescription":
      "Track ingestion state and indexed chunks for each document.",
    "adminRag.delete.title": "Delete RAG",
    "adminRag.delete.description":
      "Permanently remove this RAG, its documents, and access records.",
    "adminRag.delete.helper":
      'Type "{{slug}}" to confirm. This action cannot be undone.',
    "adminRag.delete.confirmLabel": "Confirmation",
    "adminRag.delete.button": "Delete RAG",
    "adminRag.delete.buttonPending": "Deleting…",
    "adminRag.delete.successTitle": "RAG deleted",
    "adminRag.delete.successBody":
      "The knowledge base and all related data have been removed. Continue in the admin console to keep managing assistants.",
    "adminRag.delete.successCta": "Back to admin console",

    "adminCreate.heading": "Create a knowledge base",
    "adminCreate.subtitle":
      "Provide metadata and optional documents. We will create the RAG and trigger ingestion immediately.",
    "adminCreate.overview": "New RAG",
    "adminCreate.nameLabel": "Name",
    "adminCreate.descriptionLabel": "Description",
    "adminCreate.documentsLabel": "Documents",
    "adminCreate.documentsHelp":
      "PDF, DOCX, TXT, ODT, ODS, or ODP. You can upload more later from the manage view.",
    "adminCreate.namePlaceholder": "Example: Company Handbook",
    "adminCreate.descriptionPlaceholder":
      "Short summary of what this assistant covers.",
    "adminCreate.generatedSlug": "Generated slug",
    "adminCreate.creating": "Creating…",
    "adminCreate.sections.detailsTitle": "Details",
    "adminCreate.sections.detailsDescription":
      "Enter the core metadata for this RAG.",
    "adminCreate.sections.promptTitle": "Response instructions",
    "adminCreate.sections.promptDescription":
      "Optionally tune how this assistant answers from its retrieved context.",
    "adminCreate.promptLabel": "System prompt",
    "adminCreate.promptHelp":
      "Leave empty to use the default RAG prompt shown as the placeholder. This can be edited later from the RAG management view.",
    "adminCreate.sections.documentsTitle": "Documents",
    "adminCreate.sections.documentsDescription":
      "Upload optional PDF, DOCX, TXT, ODT, ODS, or ODP files to ingest immediately after creation.",
    "adminCreate.visibilityLabel": "Visibility",
    "adminCreate.visibilityHelp":
      "Public assistants are chat-accessible without signing in. Uploads and admin actions remain restricted to admins.",
    "adminCreate.visibilityPrivate": "Private",
    "adminCreate.visibilityPublic": "Public",
    "adminCreate.errors.missingName": "Name is required.",
    "adminCreate.errors.missingDescription": "Description is required.",
    "adminCreate.errors.missingSlug":
      "Slug could not be generated from the name.",
    "adminCreate.latestJob": "Latest indexing job: {{id}}",
    "adminCreate.successMessageWithDocs":
      'RAG "{{name}}" created successfully. Document indexing has started.',
    "adminCreate.successMessageNoDocs":
      'RAG "{{name}}" created successfully. You can add documents from the manage view.',
    "adminCreate.successTitle": "🎉 RAG created",
    "adminCreate.successSubtitle":
      "You’re all set! Head back to the admin console to keep building this assistant.",
    "adminCreate.backToAdmin": "Back to admin console",
    "adminCreate.processingTitle": "Processing RAG",
    "adminCreate.processingBody":
      "We’re creating “{{name}}” and indexing your documents right now.",
    "adminCreate.processingProgress": "Indexing documents… {{progress}}%",
    "adminCreate.processingSubtitle":
      "Stay on this page to follow ingestion. We’ll keep you posted.",
    "adminCreate.processingCta": "Processing…",
    "adminCreate.processingDocs": "Documents: {{done}} / {{total}}",
    "adminCreate.processingChunks": "Chunks: {{done}} / {{total}}",
    "adminCreate.processingPhase": "Step: {{phase}}",
    "adminCreate.successBody":
      "RAG “{{name}}” is ready. You can jump into the detail view to review indexing.",
    "adminCreate.successCta": "Go to RAG",
    "adminCreate.errorTitle": "Couldn’t create the RAG",
    "adminCreate.errorBody":
      "Something went wrong during creation. Please try again or check the logs.",
    "adminCreate.errorCta": "Close",
    "adminCreate.successProcessingTitle": "🎉 Congratulations",
    "adminCreate.successProcessingBody":
      "RAG “{{name}}” is being processed right now. We’ll take you to the detail view so you can watch the ingestion progress.",
    "adminCreate.successProcessingSubtitle":
      "This keeps you informed as documents index and status updates roll in.",
    "adminCreate.viewProgress": "View progress",

    "adminAccess.needsAdmin": "You need admin access to view this area.",
    "adminAccess.backToDashboard": "Back to dashboard",

    "admin.settings": "Settings",
    "adminSettings.overview": "Settings overview",
    "adminSettings.title": "LLM & Embeddings",
    "adminSettings.subtitle":
      "Connect a provider to enable AI‑generated answers.",
    "adminSettings.providerTitle": "LLM provider",
    "adminSettings.providerDesc":
      "Choose OpenAI or a self‑hosted vLLM endpoint.",
    "adminSettings.provider": "Provider",
    "adminSettings.baseUrl": "Base URL (vLLM)",
    "adminSettings.baseUrlHelp":
      "Point to your vLLM OpenAI-compatible base, e.g. http://localhost:8001/v1.",
    "adminSettings.apiKey": "API key",
    "adminSettings.apiKeyPlaceholder": "Enter your API key (will be encrypted)",
    "adminSettings.apiKeyHelpOpenai":
      "Required for OpenAI requests. Stored encrypted; never shown.",
    "adminSettings.apiKeyHelpVllm":
      "Optional for vLLM if your endpoint requires auth. Stored encrypted; never shown.",
    "adminSettings.testButton": "Test connection",
    "adminSettings.testing": "Testing…",
    "adminSettings.testEmbeddings": "Test embeddings",
    "adminSettings.testingEmbeddings": "Testing embeddings…",
    "adminSettings.embeddingDim": "Embedding dimension",
    "adminSettings.test.ok": "Connection verified.",
    "adminSettings.test.fail": "Could not verify the provider.",
    "adminSettings.refreshModels": "Refresh models",
    "adminSettings.modelsEmpty":
      "No models returned. Check the base URL and provider.",
    "adminSettings.modelsHintVllm":
      "Enter the model IDs exposed by vLLM, or refresh to discover them.",
    "adminSettings.embedProvider": "Embeddings source",
    "adminSettings.embedProviderOpenai": "OpenAI API",
    "adminSettings.embedProviderLocal": "Local (sentence-transformers)",
    "adminSettings.embedProviderHelp":
      "Choose whether embeddings run locally or via OpenAI.",
    "adminSettings.localEmbedHelp":
      "Runs locally using sentence-transformers; downloads weights on first use.",
    "adminSettings.status.notConfigured": "Not configured",
    "adminSettings.status.connected": "Connected",
    "adminSettings.status.error": "Error",
    "adminSettings.lastVerified": "Last verified",
    "adminSettings.rebuildNotice":
      "Embeddings changed. Rebuild indexes for best results.",
    "adminSettings.rebuildAll": "Rebuild all indexes",
    "adminSettings.replaceKey": "Replace key",
    "adminSettings.clearKey": "Clear key",
    "adminSettings.requiredFields":
      "Fill in the required provider fields to test and save.",
  },
  fr: {
    "layout.userMenu.adminConsole": "Console d'administration",
    "layout.userMenu.userProfile": "Profil utilisateur",
    "layout.userMenu.signOut": "Déconnexion",
    "layout.loadingWorkspace": "Chargement de votre espace de travail…",
    "layout.footer.build": "Build n°{{build}} · {{year}}",

    "dashboard.workspaceOverview": "Vue d’ensemble de l’espace de travail",
    "dashboard.welcome": "Bon retour, {{name}}",
    "dashboard.defaultName": "opérateur",
    "dashboard.intro":
      "Choisissez un assistant pour ouvrir l’interface de chat. Les données proviennent de",
    "dashboard.error": "Impossible de charger les assistants pour le moment.",
    "dashboard.retry": "Réessayer",
    "dashboard.accessibleAssistants": "Assistants disponibles ({{count}})",
    "dashboard.loadingAssistants": "Chargement des assistants…",
    "dashboard.emptyAssistants":
      "Aucun assistant disponible pour le moment. Demandez à un administrateur d’en partager un ou d’ajouter des documents depuis la console d’administration.",
    "dashboard.select": "Ouvrir",
    "dashboard.openAdminConsole": "Ouvrir la console d’administration",

    "common.backHome": "Retour à l’accueil",
    "common.backAdmin": "Retour à l’administration",
    "common.cancel": "Annuler",
    "common.createRag": "Créer un RAG",
    "common.uploadAndIndex": "Téléverser et lancer l’indexation",
    "common.uploading": "Téléversement…",
    "common.save": "Enregistrer",
    "common.saving": "Enregistrement…",
    "common.rebuildIndex": "Reconstruire l’index",
    "common.rebuilding": "Reconstruction…",
    "common.opening": "Ouverture…",
    "common.resetIndex": "Réinitialiser l’index",
    "common.resetting": "Réinitialisation…",
    "common.resetConfirm":
      "La réinitialisation supprime tous les fragments indexés et les métadonnées. Continuer ?",
    "common.inviteUser": "Inviter un utilisateur",
    "common.remove": "Supprimer",
    "common.documents": "Documents",
    "common.status": "Statut",
    "common.chunks": "Fragments",
    "common.lastUpdated": "Dernière mise à jour",
    "common.loading": "Chargement…",
    "auth.login.heading": "Bon retour",
    "auth.register.heading": "Créer un compte",
    "auth.login.subtitle": "Connectez-vous pour gérer vos assistants RAG.",
    "auth.login.emailLabel": "E-mail",
    "auth.login.emailPlaceholder": "vous@entreprise.com",
    "auth.login.passwordLabel": "Mot de passe",
    "auth.login.passwordPlaceholder": "••••••••",
    "auth.login.authenticating": "Authentification…",
    "auth.login.submit": "Se connecter",
    "auth.register.submit": "S’inscrire et se connecter",
    "auth.login.toggleToRegister": "Besoin d’un compte ?",
    "auth.register.toggleToLogin": "Vous avez déjà un compte ?",
    "auth.login.defaultError": "Impossible de vous authentifier",
    "auth.login.sectionLabel": "Accès sécurisé",
    "auth.login.heroBadge": "Vos connaissances métiers. Surpuissantes.",
    "auth.login.heroTitle": "Pilotez plus vite avec ChatFleet",
    "auth.login.heroSubtitle":
      "Transformez vos docs et outils en réponses instantanées — là où vous travaillez déjà.",
    "auth.login.heroTagline": "→ Plus malin. Plus rapide. Données maîtrisées.",
    "auth.login.heroChooseTitle":
      "Pourquoi les entreprises en croissance choisissent ChatFleet",
    "auth.login.heroPoint1":
      "🚀 Démarrez en minutes. Importez, connectez votre LLM et déployez.",
    "auth.login.heroPoint2":
      "💬 Partout où vous êtes : Slack, WhatsApp, Telegram, Notion, web.",
    "auth.login.heroPoint3": "📂 Une console pour toute la connaissance.",
    "auth.login.heroPoint4":
      "🔒 Rôles, invitations, audits — pensé pour les équipes.",
    "auth.login.heroPoint5":
      "📊 Suivi en temps réel de l’ingestion et de l’indexation.",
    "auth.login.heroFreedomTitle": "La liberté en standard",
    "auth.login.heroFreedomPoint1": "🧩 Open‑source. Pas de verrouillage.",
    "auth.login.heroFreedomPoint2": "🛡️ Auto‑hébergé = données sous contrôle.",
    "auth.login.heroFreedomPoint3":
      "♾️ Illimité en chats, documents, assistants.",
    "auth.login.heroFreedomPoint4": "💰 Coûts prévisibles. BYO LLM.",
    "auth.login.footerSecurity": "Espace de travail vérifié · Sécurisé TLS",
    "auth.login.footerAgent":
      "Propulsé par ChatFleet Frontend Integration Agent (édition Codex).",

    "ragDetail.notAvailable":
      "Le RAG « {{slug}} » n’est pas disponible pour votre compte.",
    "ragDetail.loading": "Chargement du contexte de l’assistant pour {{slug}}…",

    "thread.welcomeTitle": "Bonjour !",
    "thread.welcomeSubtitle": "Comment puis-je vous aider ?",
    "thread.suggestion.weather.title": "Quel temps fait-il",
    "thread.suggestion.weather.description": "à San Francisco ?",
    "thread.suggestion.weather.action": "Quel temps fait-il à San Francisco ?",
    "thread.suggestion.hooks.title": "Explique les hooks React",
    "thread.suggestion.hooks.description": "comme useState et useEffect",
    "thread.suggestion.hooks.action":
      "Explique les hooks React comme useState et useEffect",
    "thread.suggestion.sql.title": "Écrire une requête SQL",
    "thread.suggestion.sql.description": "pour trouver les meilleurs clients",
    "thread.suggestion.sql.action":
      "Écris une requête SQL pour trouver les meilleurs clients",
    "thread.suggestion.meal.title": "Créer un plan repas",
    "thread.suggestion.meal.description": "pour une perte de poids saine",
    "thread.suggestion.meal.action":
      "Crée un plan de repas pour une perte de poids saine",
    "thread.composer.placeholder": "Envoyer un message...",
    "thread.composer.ariaLabel": "Zone de saisie du message",
    "thread.tooltips.send": "Envoyer le message",
    "thread.tooltips.cancel": "Arrêter la génération",
    "thread.tooltips.copy": "Copier",
    "thread.tooltips.refresh": "Actualiser",
    "thread.tooltips.edit": "Modifier le message",
    "thread.edit.cancelAria": "Annuler la modification",
    "thread.edit.update": "Mettre à jour",
    "thread.edit.updateAria": "Mettre à jour le message",
    "thread.branch.previous": "Précédent",
    "thread.branch.next": "Suivant",

    "threadList.newThread": "Nouvelle discussion",
    "threadList.archiveTooltip": "Archiver la discussion",
    "threadList.newChatFallback": "Nouvelle discussion",

    "assistant.sources": "Sources",
    "assistant.selector.label": "Choisir un assistant",
    "assistant.selector.placeholder": "Sélectionnez un assistant",
    "assistant.sourcesEntry": "{{position}}. {{filename}} · pages {{pages}}",
    "assistant.error.noContext":
      "Aucun extrait pertinent n’a été trouvé. Reformulez votre question ou ajoutez des documents pour cet assistant.",
    "thread.suggestionGroupLabel": "Questions suggérées",
    "publicRag.list.title": "Assistants publics",
    "publicRag.list.subtitle":
      "Tout le monde peut ouvrir et chatter avec ces assistants — sans connexion.",
    "publicRag.list.empty": "Aucun assistant public pour l’instant.",
    "publicRag.open": "Ouvrir",
    "publicRag.back": "Retour à la liste publique",
    "publicRag.docsTitle": "Documents",
    "publicRag.metadataTitle": "Métadonnées",
    "publicRag.visibility.public": "Public",
    "publicRag.hero.subtitle":
      "Tout le monde peut discuter avec cet assistant — sans se connecter.",
    "publicRag.hero.descriptionFallback":
      "Cet assistant est public. Lancez une conversation ou explorez les documents sources ci-dessous.",
    "publicRag.description.missing":
      "Cet assistant est public. Commencez à discuter pour explorer son contenu.",
    "publicRag.prompt.title": "Posez votre question",
    "publicRag.prompt.subtitle":
      "Décrivez ce que vous cherchez. Les suggestions ci-dessous peuvent vous inspirer.",
    "publicRag.composer.placeholder":
      "Ex : Comment déclarer et manipuler des tableaux en Perl ?",
    "publicRag.suggestions.title": "Suggestions",
    "publicRag.suggestions.q1": "Quelles sont les notions clés abordées ici ?",
    "publicRag.suggestions.q2": "Peux-tu résumer les étapes pour démarrer ?",
    "publicRag.suggestions.q3":
      "Comment travailler avec les tableaux dans ce guide ?",
    "publicRag.suggestions.q4": "Donne-moi un exemple rapide à réutiliser.",
    "publicRag.answerLabel": "Réponse issue de la documentation",

    "admin.header.overview": "Console d’administration",
    "admin.header.title": "Surface de contrôle",
    "admin.header.subtitle":
      "Consultez la configuration, les utilisateurs et les RAG. Les valeurs sont validées via les schémas Zod partagés.",
    "admin.runtime.title": "Configuration runtime",
    "admin.runtime.chatModel": "Modèle de chat",
    "admin.runtime.embeddingModel": "Modèle d’embedding",
    "admin.runtime.indexDir": "Répertoire d’index",
    "admin.runtime.uploadDir": "Répertoire de téléversement",
    "admin.runtime.maxUpload": "Taille maximale de téléversement",
    "admin.runtime.loading": "Chargement de la configuration…",
    "admin.runtime.description":
      "Consultez les valeurs appliquées actuellement au runtime.",
    "admin.users.title": "Utilisateurs",
    "admin.users.loading": "Chargement des utilisateurs…",
    "admin.users.total": "Total utilisateurs",
    "admin.users.admins": "Administrateurs",
    "admin.users.subtitle": "Suivez qui a accès à la plateforme.",
    "admin.ragSection.title": "Instances RAG",
    "admin.ragSection.subtitle":
      "Gérez les bases de connaissances existantes. Utilisez le bouton ci-dessus pour en créer de nouvelles.",
    "admin.ragSection.loading": "Chargement des RAG…",
    "admin.ragSection.empty":
      "Aucun RAG n’est disponible. Utilisez le bouton ci-dessus pour en ajouter un.",
    "admin.manage": "Gérer",
    "admin.language.label": "Langue de l’interface",
    "admin.language.english": "Anglais",
    "admin.language.french": "Français",
    "admin.language.description": "Choisissez la langue de l’interface.",
    "admin.language.helper":
      "Cette préférence est enregistrée localement sur votre appareil.",

    "adminRag.manageHeading": "Gestion du RAG",
    "adminRag.subtitle":
      "Téléversez des documents, reconstruisez ou réinitialisez l’index et gérez les accès utilisateurs pour cet assistant.",
    "adminRag.metadata.title": "Métadonnées",
    "adminRag.metadata.loading": "Chargement des métadonnées…",
    "adminRag.metadata.description":
      "Les métadonnées du RAG sont introuvables. Provisionnez le slug via les outils backend puis réessayez.",
    "adminRag.metadata.return": "Retourner à la console d’administration",
    "adminRag.metadata.slug": "Slug",
    "adminRag.metadata.name": "Nom",
    "adminRag.metadata.descriptionLabel": "Description",
    "adminRag.metadata.indexedChunks": "Fragments indexés",
    "adminRag.metadata.lastUpdated": "Dernière mise à jour",
    "adminRag.prompt.title": "Instructions de réponse",
    "adminRag.prompt.description":
      "Ajustez la manière dont cet assistant répond sans modifier les documents indexés.",
    "adminRag.prompt.loading": "Chargement des instructions de réponse…",
    "adminRag.prompt.label": "Prompt système",
    "adminRag.prompt.help":
      "S’applique aux prochaines conversations. Ne reconstruit pas l’index. Réinitialisez pour restaurer le prompt RAG par défaut.",
    "adminRag.prompt.save": "Enregistrer le prompt",
    "adminRag.prompt.reset": "Réinitialiser par défaut",
    "adminRag.prompt.saved": "Prompt enregistré.",
    "adminRag.docs.title": "Ingestion de documents",
    "adminRag.docs.instructions":
      "Formats acceptés : PDF, DOCX, TXT, ODT, ODS ou ODP. La taille maximale est contrôlée par le backend.",
    "adminRag.docs.unavailable":
      "Les documents deviennent disponibles une fois que le RAG est provisionné.",
    "adminRag.errors.metadataUnavailable": "Métadonnées du RAG indisponibles.",
    "adminRag.errors.selectFiles":
      "Sélectionnez au moins un fichier PDF, DOCX, TXT, ODT, ODS ou ODP à téléverser.",
    "adminRag.docs.latestJob": "Dernier job de téléversement : {{id}}",
    "adminRag.docs.filename": "Nom du fichier",
    "adminRag.visibility.label": "Visibilité",
    "adminRag.visibility.private":
      "Privé (seuls les utilisateurs partagés peuvent chatter)",
    "adminRag.visibility.public":
      "Public (toute personne avec le lien peut chatter)",
    "adminRag.index.title": "Maintenance de l’index",
    "adminRag.index.unavailable":
      "Les actions d’indexation deviennent disponibles une fois le RAG provisionné.",
    "adminRag.index.latestRebuild": "Dernier job de reconstruction : {{id}}",
    "adminRag.index.latestReset": "Dernier job de réinitialisation : {{id}}",
    "adminRag.users.title": "Accès utilisateurs",
    "adminRag.users.unavailable":
      "Provisionnez le RAG pour inviter des collaborateurs.",
    "adminRag.users.placeholder": "utilisateur@entreprise.com",
    "adminRag.users.empty":
      "Aucun utilisateur pour le moment. Invitez des personnes ci-dessus.",
    "adminRag.docs.empty": "Aucun document téléversé pour le moment.",
    "adminRag.docs.count": "Documents ({{count}})",
    "adminRag.sections.metadataDescription":
      "Consultez les attributs clés de cette instance RAG.",
    "adminRag.sections.documentsDescription":
      "Téléversez des documents (PDF, DOCX, TXT, ODT, ODS, ODP) pour enrichir la base de connaissances.",
    "adminRag.sections.indexDescription":
      "Lancez les tâches de maintenance pour rafraîchir ou réinitialiser l’index.",
    "adminRag.sections.usersDescription":
      "Gérez qui peut accéder à cet assistant.",
    "adminRag.sections.catalogDescription":
      "Suivez l’état d’ingestion et les fragments indexés de chaque document.",
    "adminRag.delete.title": "Supprimer le RAG",
    "adminRag.delete.description":
      "Supprime définitivement ce RAG, ses documents et ses accès.",
    "adminRag.delete.helper":
      "Tapez « {{slug}} » pour confirmer. Cette action est irréversible.",
    "adminRag.delete.confirmLabel": "Confirmation",
    "adminRag.delete.button": "Supprimer le RAG",
    "adminRag.delete.buttonPending": "Suppression…",
    "adminRag.delete.successTitle": "RAG supprimé",
    "adminRag.delete.successBody":
      "La base de connaissances et toutes les données associées ont été supprimées. Vous pouvez poursuivre la gestion depuis la console d’administration.",
    "adminRag.delete.successCta": "Retour à la console d’administration",

    "adminCreate.heading": "Créer une base de connaissances",
    "adminCreate.subtitle":
      "Fournissez les métadonnées et, en option, des documents. Nous créerons le RAG et lancerons immédiatement l’ingestion.",
    "adminCreate.overview": "Nouveau RAG",
    "adminCreate.nameLabel": "Nom",
    "adminCreate.descriptionLabel": "Description",
    "adminCreate.documentsLabel": "Documents",
    "adminCreate.documentsHelp":
      "PDF, DOCX, TXT, ODT, ODS ou ODP. Vous pourrez en ajouter d’autres depuis la vue de gestion.",
    "adminCreate.namePlaceholder": "Exemple : Guide de l’entreprise",
    "adminCreate.descriptionPlaceholder":
      "Court résumé de ce que couvre cet assistant.",
    "adminCreate.generatedSlug": "Slug généré",
    "adminCreate.creating": "Création…",
    "adminCreate.sections.detailsTitle": "Détails",
    "adminCreate.sections.detailsDescription":
      "Renseignez les métadonnées principales de ce RAG.",
    "adminCreate.sections.promptTitle": "Instructions de réponse",
    "adminCreate.sections.promptDescription":
      "Ajustez au besoin la manière dont cet assistant répond à partir du contexte retrouvé.",
    "adminCreate.promptLabel": "Prompt système",
    "adminCreate.promptHelp":
      "Laissez vide pour utiliser le prompt RAG par défaut affiché comme placeholder. Vous pourrez le modifier plus tard depuis la vue de gestion.",
    "adminCreate.sections.documentsTitle": "Documents",
    "adminCreate.sections.documentsDescription":
      "Téléversez des fichiers PDF, DOCX, TXT, ODT, ODS ou ODP optionnels qui seront ingérés immédiatement après la création.",
    "adminCreate.visibilityLabel": "Visibilité",
    "adminCreate.visibilityHelp":
      "Les assistants publics sont accessibles en chat sans connexion. Les téléversements et actions admin restent réservés aux administrateurs.",
    "adminCreate.visibilityPrivate": "Privé",
    "adminCreate.visibilityPublic": "Public",
    "adminCreate.errors.missingName": "Le nom est requis.",
    "adminCreate.errors.missingDescription": "La description est requise.",
    "adminCreate.errors.missingSlug":
      "Le slug n’a pas pu être généré à partir du nom.",
    "adminCreate.latestJob": "Dernier job d’indexation : {{id}}",
    "adminCreate.successMessageWithDocs":
      'Le RAG "{{name}}" a été créé avec succès. L’indexation des documents a commencé.',
    "adminCreate.successMessageNoDocs":
      'Le RAG "{{name}}" a été créé avec succès. Vous pourrez ajouter des documents depuis la vue de gestion.',
    "adminCreate.successTitle": "🎉 RAG créé",
    "adminCreate.successSubtitle":
      "Tout est prêt ! Retournez à la console d’administration pour continuer.",
    "adminCreate.backToAdmin": "Retour à la console d’administration",
    "adminCreate.processingTitle": "Traitement du RAG",
    "adminCreate.processingBody":
      "Nous créons « {{name}} » et indexons vos documents en ce moment.",
    "adminCreate.processingProgress":
      "Indexation des documents… {{progress}} %",
    "adminCreate.processingSubtitle":
      "Restez sur cette page pour suivre l’ingestion. Nous vous tenons informé.",
    "adminCreate.processingCta": "Traitement en cours…",
    "adminCreate.processingDocs": "Documents : {{done}} / {{total}}",
    "adminCreate.processingChunks": "Fragments : {{done}} / {{total}}",
    "adminCreate.processingPhase": "Étape : {{phase}}",
    "adminCreate.successBody":
      "Le RAG « {{name}} » est prêt. Accédez à sa fiche pour revoir l’indexation.",
    "adminCreate.successCta": "Aller au RAG",
    "adminCreate.errorTitle": "Impossible de créer le RAG",
    "adminCreate.errorBody":
      "Une erreur est survenue lors de la création. Réessayez ou vérifiez les journaux.",
    "adminCreate.errorCta": "Fermer",
    "adminCreate.successProcessingTitle": "🎉 Félicitations",
    "adminCreate.successProcessingBody":
      "Le RAG « {{name}} » est en cours de traitement. Nous allons vous rediriger vers sa fiche détaillée pour suivre l’ingestion.",
    "adminCreate.successProcessingSubtitle":
      "Vous pourrez ainsi suivre l’indexation des documents et les mises à jour d’état.",
    "adminCreate.viewProgress": "Voir la progression",

    "adminAccess.needsAdmin":
      "Vous devez être administrateur pour accéder à cette zone.",
    "adminAccess.backToDashboard": "Retour au tableau de bord",

    "admin.settings": "Paramètres",
    "adminSettings.overview": "Aperçu des paramètres",
    "adminSettings.title": "LLM et embeddings",
    "adminSettings.subtitle":
      "Connectez un fournisseur pour activer les réponses générées par IA.",
    "adminSettings.providerTitle": "Fournisseur LLM",
    "adminSettings.providerDesc":
      "Choisissez OpenAI ou une instance vLLM auto‑hébergée.",
    "adminSettings.provider": "Fournisseur",
    "adminSettings.baseUrl": "URL de base (vLLM)",
    "adminSettings.baseUrlHelp":
      "Pointez vers la base OpenAI‑compatible de vLLM, ex. http://localhost:8001/v1.",
    "adminSettings.apiKey": "Clé API",
    "adminSettings.apiKeyPlaceholder":
      "Saisissez votre clé API (sera chiffrée)",
    "adminSettings.apiKeyHelpOpenai":
      "Requise pour OpenAI. Stockée chiffrée ; jamais affichée.",
    "adminSettings.apiKeyHelpVllm":
      "Optionnelle pour vLLM si votre endpoint exige une auth. Stockée chiffrée ; jamais affichée.",
    "adminSettings.testButton": "Tester la connexion",
    "adminSettings.testing": "Test en cours…",
    "adminSettings.testEmbeddings": "Tester les embeddings",
    "adminSettings.testingEmbeddings": "Test des embeddings…",
    "adminSettings.embeddingDim": "Dimension d’embedding",
    "adminSettings.test.ok": "Connexion vérifiée.",
    "adminSettings.test.fail": "Impossible de vérifier le fournisseur.",
    "adminSettings.refreshModels": "Actualiser les modèles",
    "adminSettings.modelsEmpty":
      "Aucun modèle retourné. Vérifiez l’URL de base et le fournisseur.",
    "adminSettings.modelsHintVllm":
      "Renseignez les IDs de modèles exposés par vLLM, ou actualisez-les.",
    "adminSettings.embedProvider": "Source des embeddings",
    "adminSettings.embedProviderOpenai": "API OpenAI",
    "adminSettings.embedProviderLocal": "Local (sentence-transformers)",
    "adminSettings.embedProviderHelp":
      "Choisissez si les embeddings tournent en local ou via OpenAI.",
    "adminSettings.localEmbedHelp":
      "Exécution locale avec sentence-transformers ; téléchargement au premier usage.",
    "adminSettings.status.notConfigured": "Non configuré",
    "adminSettings.status.connected": "Connecté",
    "adminSettings.status.error": "Erreur",
    "adminSettings.lastVerified": "Dernière vérification",
    "adminSettings.rebuildNotice":
      "Les embeddings ont changé. Reconstruisez les index pour de meilleurs résultats.",
    "adminSettings.rebuildAll": "Reconstruire tous les index",
    "adminSettings.replaceKey": "Remplacer la clé",
    "adminSettings.clearKey": "Effacer la clé",
    "adminSettings.requiredFields":
      "Renseignez les champs requis pour tester et enregistrer.",
  },
} as const;
