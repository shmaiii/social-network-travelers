# Generated by Django 4.0.6 on 2022-08-12 10:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0002_post_comment'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='images',
            field=models.ImageField(blank=True, upload_to=''),
        ),
    ]
