image=brahma_aastra_put_discord
tag=latest


build_d:
		docker build -t $(image) .

push: build_d
		docker tag $(image):$(tag) 820675130125.dkr.ecr.us-east-2.amazonaws.com/$(image):latest
		aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 820675130125.dkr.ecr.us-east-2.amazonaws.com
		docker push 820675130125.dkr.ecr.us-east-2.amazonaws.com/$(image):$(tag)

run: 
		docker run -p 9000:8080 $(image):$(tag)

test:
		curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{}'
