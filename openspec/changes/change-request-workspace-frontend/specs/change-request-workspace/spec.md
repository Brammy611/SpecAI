## ADDED Requirements

### Requirement: Workspace layout
The system SHALL provide a workspace screen with a left sidebar and a main analysis area.

#### Scenario: Workspace loads
- **WHEN** the user opens the change request workspace
- **THEN** the sidebar and main analysis area are visible

### Requirement: ChatGPT-like sidebar
The sidebar MUST present a chat-style navigation with conversation entries and actions.

#### Scenario: Sidebar shows conversation list
- **WHEN** the workspace loads
- **THEN** the sidebar shows a list of conversation items

### Requirement: Recent analyses list
The system SHALL display recent analyses in the sidebar for quick access.

#### Scenario: Recent analyses visible
- **WHEN** recent analyses exist
- **THEN** the sidebar lists them in a recent section

### Requirement: OpenSpec upload
The system SHALL allow users to upload an OpenSpec file from the workspace.

#### Scenario: Upload file
- **WHEN** the user selects an OpenSpec file and confirms upload
- **THEN** the file is attached to the current analysis input

### Requirement: Repository URL input
The system SHALL provide an input for a repository URL.

#### Scenario: Enter repository URL
- **WHEN** the user enters a repository URL
- **THEN** the value is stored with the analysis input state

### Requirement: Business requirements textarea
The system SHALL provide a multiline textarea for business requirements.

#### Scenario: Enter business requirements
- **WHEN** the user types business requirements
- **THEN** the text is stored with the analysis input state

### Requirement: Analyze Impact action
The system MUST provide an Analyze Impact button to start analysis.

#### Scenario: Start impact analysis
- **WHEN** the user clicks Analyze Impact
- **THEN** the system begins the analysis flow and shows progress or results

### Requirement: Inline analysis results
The system SHALL show analysis results inline in the main area after analysis completes.

#### Scenario: Show analysis result
- **WHEN** analysis completes successfully
- **THEN** the inline analysis result section is visible

### Requirement: Technical blueprint tabs
The system SHALL present technical blueprint content in tabbed sections.

#### Scenario: Switch blueprint tabs
- **WHEN** the user selects a blueprint tab
- **THEN** the content updates to the selected blueprint view

### Requirement: Share URL
The system SHALL provide a shareable URL for an analysis.

#### Scenario: Copy share URL
- **WHEN** the user triggers Share
- **THEN** a share URL is generated and can be copied

### Requirement: Follow-up conversational analysis
The system MUST allow follow-up conversational prompts after analysis results appear.

#### Scenario: Ask a follow-up
- **WHEN** the user enters a follow-up question
- **THEN** the system appends the prompt and shows a response area
