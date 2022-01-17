# include it into another Makefile to provide default 'help' target
# check if it works: 'make help' or just 'make'

.DEFAULT_GOAL := help

git_root_var_name := git_root
git_root := $(shell git rev-parse --show-toplevel)

.PHONY: help
# first line resolves 'include' statements in a Makefile and produces a complete plain file (https://stackoverflow.com/a/41592125)
# references to $(git_root) are raplaced with actual path to Git root (otherwise Awk cannot resolve included files)
# (therefore Git root refs in 'include' statements should be called git_root in Makefiles)
# then it's parsed for pattern like 'target_name: ...maybe_something... ## target_description'
# finally, target_name and target_description are shown in a table-like fashion with fancy colors
# example:
# 	- in Makefile:
#				one: ## One is cool
#				two: one ## Two is even better
#			'make help' will output:
#				one		One is cool
#				two		Two is even better
help: ## Show help
	@awk '{ if (NF == 2 && $$1 == "include") { gsub(/\$$\($(git_root_var_name)\)/, "$(git_root)", $$2) ; while ((getline line < $$2) > 0) print line ; close($$2) } else print }' \
		$(firstword $(MAKEFILE_LIST)) \
		| grep -E '^[a-zA-Z_-]+:.*?## .*$$' \
		| sort \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
