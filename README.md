Kraken
=================

Kraken does everything. He doesn't live to serve you, but he'll come to aid those who prove themselves worthy. You cannot tame Kraken, you can redirect his power. Kraken doesn't know everything, but you can [teach him](#contributing). Don't get full of yourself, you're not mighty, Kraken is. He'll bite your ass.

## Quick Start


Download the project.

```
git clone git@github.com:groupbuddies/kraken.git
```

Create a `.env` file on the root folder with the following structure.

```
SLACK_EMAIL=''
SLACK_PASSWORD=''
GOOGLE_CLIENT_ID=''
GOOGLE_CLIENT_SECRET=''
GITHUB_ID=''
GITHUB_SECRET=''
```

Now link the package.

```
npm link .
```

## Commands

** Add user to apprenticeship github team. **

```
kraken github username
```

** Invite user to google apps.

```
kraken google email firstName lastName
```

** Add user to slack (using selenium). **

```
kraken slack email firstName lastName
```

## Contributing

Open a Pull Request.
