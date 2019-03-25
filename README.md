# Prerender.dev

## Elastic Beanstalk Environment

All services are deployed using elastic beanstalk

To install virtualenv and create an env to install awsebcli.

```
$ pip install --user virtualenv
$ virtualenv eb-env
$ source eb-env/bin/activate
$ curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
$ python get-pip.py
$ pip install awsebcli --upgrade
```

You need the correct acccess keys in ~/.aws/config with profile `eb-cli` to deploy the EB instance.