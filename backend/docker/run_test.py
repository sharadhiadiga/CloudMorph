from docker_module.docker_module import docker_module

data = {
    "app_name": "test-app",
    "stack": "node",
    "port": 3000,
    "source_path": "./sample_app"
}

result = docker_module(data)
print("\nFINAL OUTPUT:")
print(result)