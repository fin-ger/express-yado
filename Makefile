# grep the version from the mix file
VERSION=$(shell jq -rM .version package.json)

# HELP
# This will output the help for each task
# thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help

help: ## Show this help page.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help

release: tag push ## Make a release by tagging and pushing the current version to the git remote

push: ## Push all tags to the git remote
	@echo "Pushing tags to remove..."
	@git push --tags -f

tag: ## Tag the current commit with the current version
	@echo "Tagging version $(VERSION)..."
	@git tag -fsm "Update version" v$(VERSION)

version: ## Print the current version
	@echo $(VERSION)
