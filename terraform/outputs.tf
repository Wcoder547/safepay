output "instance_public_ip" {
  description = "The public IP address of the EC2 instance"
  value       = aws_instance.app_server.public_ip
}

output "ssh_command" {
  description = "Command to SSH into the instance"
  value       = "ssh -i ${var.public_key_path == "~/.ssh/id_rsa.pub" ? "~/.ssh/id_rsa" : "<YOUR_PRIVATE_KEY>"} ubuntu@${aws_instance.app_server.public_ip}"
}
