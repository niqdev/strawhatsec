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

DO_SSH_KEY := do_htb
DO_SSH_PATH := ~/.ssh/$(DO_SSH_KEY)
DO_OPENVPN_PATH := ./ctf/htb/*.ovpn
DO_SHARE_REMOTE_PATH := ~/strawhatsec/ctf/htb/share
DO_NAME := htb
DO_IMAGE := docker-20-04
DO_SIZE := s-2vcpu-4gb # 20$/month
DO_REGION := lon1

CMD_DO_IP = $(shell doctl compute droplet list --format PublicIPv4 --no-header)
# double $$ to escape
CMD_DO_FINGERPRINT = $(shell doctl compute ssh-key list -o json | jq -r --arg DO_SSH_KEY $(DO_SSH_KEY) '.[] | select(.name | contains($$DO_SSH_KEY)) | .fingerprint')

.PHONY: do-images
do-images: require-doctl
	doctl compute image list --public | grep docker
	doctl compute size list

.PHONY: do-fingerprint
do-fingerprint: require-doctl require-jq
	@echo $(CMD_DO_FINGERPRINT)

.PHONY: do-list
do-list: require-doctl
	doctl compute droplet list --format ID,Name,PublicIPv4,Status

.PHONY: do-create
do-create: require-doctl require-jq
	doctl compute droplet create \
		--image $(DO_IMAGE) \
		--size $(DO_SIZE) \
		--region $(DO_REGION) \
		--ssh-keys $(CMD_DO_FINGERPRINT) \
		--tag-name docker \
		--enable-private-networking \
		--enable-monitoring \
		--wait \
		$(DO_NAME)

.PHONY: do-delete
do-delete: require-doctl
	doctl compute droplet delete $(DO_NAME)

.PHONY: do-access
do-access: do-list do-fingerprint
	ssh -o "StrictHostKeyChecking no" -i $(DO_SSH_PATH) root@$(CMD_DO_IP)

##############################

.PHONY: do-htb-tunnel
do-htb-tunnel:
	ssh -N \
		-L 5900:127.0.0.1:5900 \
		-L 5901:127.0.0.1:5901 \
		-L 6080:127.0.0.1:6080 \
		-L 6081:127.0.0.1:6081 \
		-i $(DO_SSH_PATH) root@$(CMD_DO_IP)

.PHONY: do-htb-vpn
do-htb-vpn:
	scp -i $(DO_SSH_PATH) $(DO_OPENVPN_PATH) root@$(CMD_DO_IP):$(DO_SHARE_REMOTE_PATH)

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

##############################

.PHONY: site-start
site-start: require-yarn
	./scripts/website_apply.sh "site-start"
