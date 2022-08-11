from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):
    post_author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="post_author")
    location = models.CharField(max_length=64)
    content = models.TextField()
    likes = models.IntegerField(default=0)
    time_posted = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.location} by {self.author}" 

class Comment(models.Model):
    comment_author=models.ForeignKey(User, on_delete=models.CASCADE, related_name="comment_author")
    content=models.TextField()
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post")
    time_posted = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.author} commented on {self.post}"
    