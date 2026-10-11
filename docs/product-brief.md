# Why am I building this?

To solve one problem: during design QA, it is hard to check every screen case after a feature is built.

## How do people do it today?

1. The developer and designer sit together and check the screens.
2. The developer defines cases in Storybook and deploys it. Then the designer checks the cases in Storybook.
3. The developer sends a test URL and switches the data by hand.
4. The developer takes screenshots and sends them to the designer.
5. The designer creates test data in an admin tool and checks each case.

## What do designers check in design QA?

- Data states: empty, 1 item, 2 or more items
- Loading and error states
- States that change by user permission
- States that change by feature flag (for example, A/B tests)
- States that change by device size
- Styles (for example, color and font)

---

# Who am I building it for?

- Designers who want to see all the designed cases.
- Designers who are new to dev concepts like repos and branches.

---

# When and where will it be used?

- During design QA. This happens after the developer finishes building and before functional testing.
- In everyday work settings, like a team workspace.

---

# What am I building?

A tool that reads the code with AI and shows every case as a visual. The designer does not need help from a developer. The designer does not need to set up data by hand.

## User needs

### 1. Before design QA

- I want to know how I can do design QA in this tool.
- I want to know how to get started. For example, which screen should I load?

### 2. During design QA

- I want to see all the designed cases. For example, cases by user type, loading, error, and others.
  - AI should read the code and suggest the cases first.
- I want to leave feedback on a design or a case.

### 3. After design QA

- I want to send my fixes to the developer.
- I want to know if the developer has applied the fixes.

### 4. Re-check

- I want to review the updated designs.
- If a fix is still missing, I want to flag it again.
- If everything is fixed, I want to approve it.
- I want to see the comments I left before.

### 5. Other

- I want to manage and view other projects.
- I want to see the deploy status.

---

# How could I measure it?

- Accuracy: compare the cases AI draws with the cases that are actually built.
- Conversion rate: how many reviews reach approval.
