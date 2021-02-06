.DEFAULT_GOAL := htb-up

require-%:
	@ if [ "$(shell command -v ${*} 2> /dev/null)" = "" ]; then \
		echo "[$*] not found"; \
		exit 1; \
	fi

check-param-%:
	@ if [ "${${*}}" = "" ]; then \
		echo "Missing parameter: [$*]"; \
		exit 1; \
	fi

##############################

.PHONY: htb-up
htb-up: require-docker
	docker-compose -f ctf/htb/docker-compose.yml up -d

.PHONY: htb-down
htb-down: require-docker
	docker-compose -f ctf/htb/docker-compose.yml down -v

.PHONY: htb-logs
htb-logs: require-docker
	docker-compose -f ctf/htb/docker-compose.yml logs -f -t
